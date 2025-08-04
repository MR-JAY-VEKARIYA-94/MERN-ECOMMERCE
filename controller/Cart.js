const { Cart } = require("../model/Cart")

exports.fetchCartByUser = async (req,res) => {
    const { id } = req.user
    try{
       const cartItems = await Cart.find({user : id}).populate('product')
       res.status(200).json(cartItems)
    }catch(err){
        res.status(400).json(err)
    }
}

exports.addToCart = async (req, res) => {
    const { id } = req.user
    const cart = new Cart({...req.body, user : id});
    try{
        const docs = await cart.save()
        const result = await docs.populate('product')
        res.status(201).json(result)
    }catch(err){
        res.status(400).json(err)   
    }
  }

  exports.deleteFromCart = async (req, res) => {
    const { id } = req.params;
    try{
        const docs = await Cart.findByIdAndDelete(id)
        res.status(201).json(result)
    }catch(err){
        res.status(400).json(err)   
    }
}

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {new:true});
    const result = await cart.populate('product')
    res.status(200).json(result);
   // console.log("cart update bro ~~")
  } catch (err) {
    res.status(400).json(err);
  }
};