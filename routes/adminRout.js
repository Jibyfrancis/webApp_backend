const express = require('express');
const router=require ('express').Router()
const bcrypt = require('bcrypt');
const ObjId = require('mongodb').ObjectId;
const secretKey = "mdfj948q34092342084@341"
const adminModelSchema = require('../model/admin');
const authModelSchema = require('../model/user');

const admin={email:'Admin@gmail.com',pass:'123'}

router.post('/login', async (req, res) => {
    console.log("admin login");
    const {email,password} =req.body;
    if(email==admin.email&&password==admin.pass){
        res.json({ status: "ok", })
    }else{
        res.json({ status: "error"})

    }
    // const email = req.body.email;
    // const password = req.body.password;

    // await adminModelSchema.findOne({ email: email }).then(existAdmin => {
    //     if (existAdmin && existAdmin._id) {
    //         bcrypt.compare(password, existAdmin.password, (err, response) => {
    //             if (!err) {
    //                 res.json({ status: "ok", data: { existAdmin, response } })
    //             } else {
    //                 res.json({ status: "error", data: { existAdmin, response } })
    //             }
    //         })
    //     }
    // }).catch(err => {
    //     res.json({ status: "Error", data: "something went wrong" })
    // })
})

router.get('/dashboard', async (req, res) => {
    let users = await authModelSchema.find()
    res.json(users)
})

router.post('/deleteUser', async (req, res) => {
    console.log(req.body);
    const user = req.body._id;
    await authModelSchema.deleteOne({ _id:new ObjId(user) })
        .then((data) => {
            console.log(data);
            res.json({ status: true, message: "deleted the user", data });
        })
        .catch((err) => {
            res.json({ status: false, message: "failed to delete the user", error: err });
        });
})

router.get('/doUserSearch', async(req, res) => {
    const name = req.query.name;
    await authModelSchema.find({ username: { $regex: name } }).then((data) => {
        res.json({ data });     
    });
})

router.get('/getUser/:id', async(req,res)=>{
    console.log(req.params.id);
    await authModelSchema.findOne({_id:new ObjId(req.params.id)}).then((user)=>{
        console.log(user);
       
        res.json(user)
        
    })

})

module.exports = router
