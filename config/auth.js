module.exports = {
    membersOnly: function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
        req.flash('error_msg', '!Oops.. Sign in for that :)')
        res.redirect('users/signin')
    }
}