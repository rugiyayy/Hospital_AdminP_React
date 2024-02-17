import { useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { httpClient } from "../utils/httpClient";
import registerSchema from "../validations/registerSchema";

export default function useSignUp() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.account);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      userName: "",
      email: "",
      isAdmin: false,
      password: "",
    },
    onSubmit: (values) => {
      setIsLoading(true);
      registerQuery(values);
    },
    validationSchema: registerSchema,
  });
  const onClose = () => {
    formik.resetForm();
  };

  const registerQuery = async (values) => {
    try {
      const response = await httpClient.post("/Account/SignUp", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Signed Up.",
        description: "You have been signed up successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      onClose();
    } catch (error) {
      console.log("errors4:", error?.response?.data?.errors?.Email);
      if (
        error.response &&
        error.response?.data &&
        error.response?.data?.errors
      ) {
        formik.setErrors(error.response?.data?.errors);
        toast({
          title: "Error",
          description:
            error?.response?.data?.errors?.Email ||
            error?.response?.data?.errors?.Password ||
            error?.response?.data?.errors?.UserName ||
            error?.response?.data?.Errors?.IsAdmin ||
            error?.response?.data?.errors?.FullName ||
            "Ups ... Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        console.log("errorrr:",error.response.data);
        toast({
          title: "Error",
          description: error.response.data|| "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log("errors1:", error.response.data.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { formik, isLoading };
}
