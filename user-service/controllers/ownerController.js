
const express = require("express")
const brcypt = require("bcrypt")
const {Owner} = require("../models/Owner")

exports.register = async (req,res) => {

    try {

        const {username, email, password} = req.body

        if(!username || !email || !password){
            return res.status(400).json({
                sucess:false,
                message:"Error!! password, email and username are required"

            })
        }

        const ownerExists =   await Owner.findOne({
            $or:[
                {username:username},
                {email:email}
            ]
        })

        if (ownerExists) {
            if (ownerExists.username === username) {
                return res.status(400).json({ message: 'Username is already taken.' });
            }
            if (ownerExists.email === email) {
                return res.status(400).json({ message: 'Email is already registered.' });
            }
        }

        const hashedPassword = await brcypt.hash(password, 10)

        const owner = await Owner.create({
            username,
            email,
            password:hashedPassword
        })

        return res.status(201).json({
            success:true,
            message:"registered successfully",
            data:owner
        })


        
        
    } catch (error) {

        console.error(error.message)

        return res.status(500).json({
            success:false,
            message:"We ran into a problem, wait as we resolve"
        })
        
    }
    
}