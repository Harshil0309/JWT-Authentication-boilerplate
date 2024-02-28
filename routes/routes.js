// install all these below files first
const router = require("express").Rputer();
const User = require("../models/user");
const bcrypt = require("bcryptsjs");
const jwt=require('jsonwebtoken');

router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  //getting user details without password
  const result = await user.save();
  const { password, ...data } = await result.toJSON();
  res.send(data);
});

router.post("/login", async (req, res) => {
  const user = await user.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send({
      message: "user not found",
    });
  }
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).send({
      message: "wrong password",
    });
  }

//   below code is for jwt auth

  const token=jwt.sign({_id:user._id,secretOrPrivateKey:'secret'})

res.cookie('jwt',token,{
    httpOnly:true,
    maxAge:24*60*60*1000,
    //maxage is set to 1 day ,, time to expire
})

  res.send({
      message:'success'
  });
});

router.get('/user',(req,res)=>{
    try {
        const cookie= req.cookies['jwt']
        const claims=jwt.verify(cookie,secreorPublicKey:'secret')
        if(!claims){
            return res.status(401).send({
                message: "Unauthenticated",
            });
        }
        const user=await User.findOne({_id:claims._id})
        const {password, ...data}=await user.toJSON();
        res.send(data)
    } catch (error) {
        return res.status(401).send({
            message: "Unauthenticated",
        });
    }
    
})

router.post('/logout',(req,res)=>{
    res.cookie('jwt','',{
        maxAge:0 
        //maxage 0 means the cookie will expire immediately
    
    })
    res.send({
        message:'success'
    })
})

module.exports = router;
