let users = [];
const name = 'Nguyễn Thanh Thiệt';
const email = 'thietnguyenthanh300@gmail.com';
const newUser = {id: Date.now().toString(), name, email};
users.push(newUser);

exports.getUsers = (req, res) => {
    res.json(users);
};

exports.createUser = (req, res) =>{
    const {name, email} = req.body;

    const newUser = {id: Date.now().toString(), name, email};
    users.push(newUser);
    res.status(201).json(newUser);
};