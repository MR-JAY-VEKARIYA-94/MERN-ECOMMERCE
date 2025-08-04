const { Order } = require("../model/Order");
const { Product } = require("../model/Product");
const { User } = require("../model/User");
const { sendMail, invoiceTemplate } = require("../service/common");

exports.fetchOrderByUser = async (req, res) => {
  const { id } = req.user
  console.log(id);
  
  try {
    const order = await Order.find({ user: id })
    console.log("function call done order read done")
    res.status(200).json(order)
  } catch (err) {
    res.status(400).json(err)
  }
}

exports.createOrder = async (req, res) => {
  console.log(req.body);
  console.log("helo")
  const order = new Order(req.body);
  //  for(let item of order.items){
  //      let product =  await Product.findOne({_id:item.product.id})
  //      product.$inc('stock',-1*item.quantity);
  //      // for optimum performance we should make inventory outside of product.
  //      await product.save()
  //   }
  console.log(order);
  try {
    const doc = await order.save()
    const user = await User.findById(order.user)
    sendMail({ to : user.email, html : invoiceTemplate(order), subject : 'Your Order Received' })
    res.status(201).json(doc)
  } catch (err) {
    res.status(400).json(err)
  }
}

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id)
    res.status(201).json(order)
  } catch (err) {
    res.status(400).json(err)
  }
}

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(order);
    console.log("cart update bro ~~")
  } catch (err) {
    res.status(400).json(err);
  }
};

 exports.fetchAllOrders = async (req, res) => {
     let query = Order.find({deleted : {$ne:true}});
     let totalOrdersQuery = Order.find({deleted : {$ne:true}});
  
     if (req.query._sort && req.query._order) {
       query = query.sort({ [req.query._sort] : req.query._order });
     }
    let totalDocs = await totalOrdersQuery.countDocuments().exec();
    //console.log({totalDocs})
 
     if (req.query._page && req.query._limit) {
       const pageSize = req.query._limit;
       const page = req.query._page;
       query = query.skip(pageSize * (page - 1)).limit(pageSize);
     }
   
     try {
       const docs = await query.exec();
       res.set('X-Total-Count', totalDocs)
       //console.log(docs)
       res.status(200).json(docs);
     } catch (err) {
       res.status(400).json(err);
     }
   };