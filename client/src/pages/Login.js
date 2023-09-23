import React from "react";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/users/login", values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.data);
        navigate("/");
      } else {
        dispatch(hideLoading());
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("something went wrong");
    }
  };
  return (
    <>
      <div className="authentication">
        <div className="authentication-form card p-3">
          <h1 className="card-title">Welcome Back</h1>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Email: " name="email">
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item label="Password: " name="password">
              <Input placeholder="Enter your password" type="password" />
            </Form.Item>

            <Button
              className="primary-button my-2 full-width-button"
              htmlType="submit"
            >
              LOGIN
            </Button>
            <Link to="/register" className="anchor mt-2">
              Click here to Register
            </Link>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
