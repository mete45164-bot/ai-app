import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function mathTool(text){
  try{
    if(/^[0-9+\-*/(). ]+$/.test(text)){
      return eval(text);
    }
  }catch{}
  return null;
}

export default async function handler(req,res){
  const {message,memory=[]}=req.body;

  // 🧮 matematik
  const math=mathTool(message);
  if(math!==null){
    return res.json({reply:"🧮 "+math});
  }

  const response=await client.chat.completions.create({
    model:"gpt-4o-mini",
    messages:[
      {
        role:"system",
        content:`
Sen Agent AI'sın:
- akıllı, kısa cevap ver
- gerektiğinde plan yap
- matematik çöz
        `
      },
      ...memory.slice(-20),
      {role:"user",content:message}
    ]
  });

  res.json({
    reply:response.choices[0].message.content
  });
}
