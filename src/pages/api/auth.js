// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
    
    if(req.method === "POST"){

        if(
            req.body.username === "testUser"&&req.body.password === "test123" ||
            req.body.username === "ikegaiuser"&&req.body.password === "ikegai@123" ||
            req.body.username === "prerna26vrm"&&req.body.password === "mahiyameremahi"
    
        ){
            
            const currentTime = new Date()
            const expirationTime = new Date(currentTime.getTime() + 1440 * 60 * 1000)
            const expires = expirationTime.toUTCString()
            
            // Thu, 01 Jan 1970 00:00:00 GMT
            res.setHeader('Set-Cookie', [
                `currUserID=${req.body.username==='testUser'?"1":req.body.username==='ikegaiuser'?"2":"3"}; Path=/; Expires=${expires}`, 
                `currUsername=${req.body.username==='testUser'?"Indresh":req.body.username==='ikegaiuser'?"Rahul":"Prerna"}; Path=/; Expires=${expires}`
            ]);

            res.status(200).json({ res: `success` });
        }
        else{
            res.status(401).json({ res: `failure` });   
        }

    }
    else{
        res.status(405).json({ res: `Method ${req.method} not allowed!` });
    }

}
  