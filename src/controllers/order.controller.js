const hbs = require("express-handlebars");
const Order = require("../models/order.model");
const Account = require("../models/account.model");
const Product = require("../models/product.model");

const sequelize = require("sequelize");
const Op = sequelize.Op;

const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");

var allProducts;

class orderController {
  // [GET] order/manage-order
  showAllOrder = async (req, res, next) => {
    try {
      // const aOrder = await Account.findOne();
      // const accountId = aOrder._id
      let page = isNaN(req.query.page)
        ? 1
        : Math.max(1, parseInt(req.query.page));
      const limit = 18;
      const accountId = req.user._id;

      const orders = await Order.find({ idSeller: accountId })
        .sort({ date: -1 })
        .populate("idAccount")
        .populate("detail.idProduct")
        .skip((page - 1) * limit)
        .limit(limit);
      const orderObject = mutipleMongooseToObject(orders);

      var products = [];
      var messages = [];
      for (var i of orderObject) {
        messages.push({ idOrder: i._id, message: i.message });
        for (var j of i.detail) {
          Object.assign(j, { idOrder: i._id });
          // var temp = [];
          // temp.push(j);
          products.push(j);
        }
      }
      res.locals._numberOfItems = await Order.find({ idSeller: accountId })
        .populate("idAccount")
        .populate("detail.idProduct")
        .countDocuments();
      res.locals._limit = limit;
      res.locals._currentPage = page;

      res.locals.orders = orderObject;
      res.locals.products = products;
      res.locals.messages = messages;
      // res.json({products})

      res.render("manage-order");
    } catch (error) {
      next(error);
    }
  };

  // [POST] product/quantity
  getQuantity = async (req, res, next) => {
    try {
      const orderId = req.body.id;
      const order = await Order.find({ _id: orderId });
      res.json(order);
    } catch (error) {
      next(error);
    }
  };

  // [PUT] order/manage-order/:id/reject
  rejectOrder = async (req, res, next) => {
    try {
      const orderId = req.params.id;
      await Order.updateOne(
        { _id: orderId },
        { $set: { status: "cancelled" } }
      );
      res.redirect("back");
    } catch (error) {
      next(error);
    }
  };

  acceptOrder = async (req, res, next) => {
    try {
      const orderId = req.params.id;
      const order = await Order.findById(orderId);
      // console.log(order);
      await order.detail.forEach(async (product) => {
        const productInfo = await Product.findById(product.idProduct);
        productInfo.stock -= product.quantity;
        await productInfo.save();
        console.log(productInfo);
      });
      await Order.updateOne(
        { _id: orderId },
        { $set: { status: "successful" } }
      );
      res.redirect("back");
    } catch (error) {
      next(error);
    }
  };

  getPayment = async (req, res, next) => {
    try {
      // const productId = req.params.id;
      const accBuyer = await Account.findOne({ _id: req.user.id });
      const product = await Product.findOne({ _id: req.params._id }).populate(
        "idAccount"
      );

      res.locals.accBuyer = mongooseToObject(accBuyer);
      res.locals.product = mongooseToObject(product);
      res.locals.quantity = req.query.quantity;

      res.render("payment");
    } catch (error) {
      next(error);
    }
  };

  getPayForCart = async (req, res, next) => {
    try {
      // const productId = req.params.id;
      const accBuyer = await Account.findOne({ _id: req.user.id }).populate({
        path: "cart._id",
        populate: {
          path: "idAccount",
        },
      });

      res.locals.accBuyer = mongooseToObject(accBuyer);

      res.render("payment-for-cart");
    } catch (error) {
      next(error);
    }
  };

  placeOrder = async (req, res, next) => {
    try {
      const accBuyer = await Account.findOne({ _id: req.user.id });
      const product = await Product.findOne({ _id: req.params._id }).populate(
        "idAccount"
      );
      const idSeller = product.idAccount;

      const newOrder = new Order({
        idAccount: accBuyer._id,
        idSeller: idSeller,
        detail: [
          {
            idProduct: product._id,
            quantity: req.query.quantity,
            isEvaluated: false,
          },
        ],
        status: "pending",
        message: req.body.message,
      });

      await newOrder.save(); // Lưu order mới vào MongoDB
      res.redirect(`/account/my-order-pending/${req.user.id}`);
    } catch (err) {
      next(error);
    }
  };

  placeOrderForCart = async (req, res, next) => {
    try {
      const accBuyer = await Account.findOne({ _id: req.user.id })
        .populate("cart._id")
        .populate("cart._id.idAccount");

      const orders = accBuyer.cart.map((cartItem) => {
        const idSeller = cartItem._id.idAccount;
        const newOrder = new Order({
          idAccount: accBuyer._id,
          idSeller: idSeller,
          detail: [
            {
              idProduct: cartItem._id._id,
              quantity: cartItem.quantity,
              isEvaluated: false,
            },
          ],
          status: "pending",
          message: req.body.message, // Cần lấy từ form đầu vào
        });
        return newOrder;
      });

      const savedOrders = await Order.insertMany(orders);
      // Xóa các sản phẩm đã được đặt hàng khỏi giỏ hàng
      accBuyer.cart = accBuyer.cart.filter(
        (cartItem) =>
          !savedOrders.some((savedOrder) =>
            savedOrder.detail[0].idProduct.equals(cartItem._id._id)
          )
      );
      req.session.cart = []; // Remove trong session
      await accBuyer.save();

      res.redirect(`/account/my-order-pending/${req.user.id}`);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new orderController();
