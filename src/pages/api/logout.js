// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {

    res.setHeader('Set-Cookie', [
        `currUserID=3; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`, 
        `currUsername=1; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    ])

    res.status(200).json({ res: `success` });

}
  