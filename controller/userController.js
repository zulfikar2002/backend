const express = require('express')
const db = require('../db.config/db.config')
const jwt = require('jsonwebtoken');
// const Auth = require('./auth')

require("dotenv").config();
const bcrypt = require('bcrypt');
SECRET = process.env.SECRET;


const register = async(req, res, next) => {
    const{username,email,password}= req.body;
    // * 7. silahkan ubah password yang telah diterima menjadi dalam bentuk hashing
    const hashed_pwd= await bcrypt.hash(password,10)
    
    // 8. Silahkan coding agar pengguna bisa menyimpan semua data yang diinputkan ke dalam database
    try {
        db.query('INSERT INTO unhan_modul_17(username,email,password) VALUES ($1,$2,$3);',[username,email,hashed_pwd])
        res.send('data added succesfully!')
        
    } catch (error) {
        res.send('Input failure!')
    }
}

const login = async(req, res, next) => {
    const{email,password}= req.body;
    try {
        const user = await db.query('SELECT * FROM unhan_modul_17 where email=$1;',[email])
        //check if user is exist
        if(user.rowCount>0){
            // 9. komparasi antara password yang diinput oleh pengguna dan password yang ada didatabase
            const validPass = await bcrypt.compare(password,user.rows[0].password)
            //check if password is match
            if (validPass) {
                // 10. Generate token menggunakan jwt sign
                let jwtSecretKey = process.env.SECRET;
                let data = {
                    id: user.rows[0].id,
                    username: user.rows[0].username,
                    email:user.rows[0].email,
                    password:user.rows[0].password
                }
                const token = jwt.sign(data, jwtSecretKey);
                
                //11. kembalikan nilai id, email, dan username
                 res.cookie("JWT", token, {httpOnly: true,sameSite: "strict"}).status(200).json({
                    id: user.rows[0].id,
                    username: user.rows[0].username,
                    email:user.rows[0].email,
                    token:token
                    });
            } else {
                return res.status(400).send('wrong pass!')   
            }
        }else{
            return res.status(400).json({
                error: "User is not registered, Sign Up first",
            })
        }
    } catch (error) {
        return res.send('login failed')
        
    }
}

const logout = async(req, res, next) => {
                
    try {
        // 14. code untuk menghilangkan token dari cookies dan 
        // mengembalikan pesan "sudah keluar dari aplikasi" 
        return res.clearCookie('JWT').send('Logout Succesfull')

    } catch (err) {
        console.log(err.message);
        return res.status(500).send(err)
    }
            
}

const verify = async(req, res, next) => {
    try {
        // 13. membuat verify
        const data = req.verified
        return res.status(200).json(data)
        
    } catch (err) {
        console.log(err.message);
        return res.status(500).send(err)    
    }
}

module.exports = {
    register,
    login,
    logout,
    verify
}