import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { CartReducerInitialState } from "../types/reducer-types";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../redux/store";
import toast from "react-hot-toast";
import { saveShippingInfo } from "../redux/reducer/cartReducer";

const Shipping = () => {
  const { cartItems, total } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const changesHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(saveShippingInfo(shippingInfo))

    try {
      const { data } = await axios.post(
        `${server}/api/v1/payment/create`,
        {
          amount: total,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/pay",{
        state:data.clientSecret,
      })
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  };

  useEffect(() => {
    const checkCart = async () => {
      if (cartItems.length <= 0) {
        navigate("/cart");
      }
    };

    checkCart();
  }, [cartItems, navigate]);

  return (
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>

      <form onSubmit={submitHandler}>
        <h1>Shipping Address</h1>

        <input
          required
          type="text"
          placeholder="address"
          name="address"
          value={shippingInfo.address}
          onChange={changesHandler}
        />

        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changesHandler}
        />

        <input
          required
          type="text"
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changesHandler}
        />

        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={changesHandler}
        >
          <option value="">Choose Country</option>
          <option value="Pakistan">Pakistan</option>
          <option value="USA">USA</option>
          <option value="Rassia">Rassia</option>
        </select>

        <input
          required
          type="number"
          placeholder="Pin Code"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changesHandler}
        />

        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Shipping;
