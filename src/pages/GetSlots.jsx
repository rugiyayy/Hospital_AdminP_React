import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  Input,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { httpClient } from "../utils/httpClient";
import { useQuery } from "react-query";
import { Spinner1 } from "../components/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { appointmentSchema } from "../validations/appointmentSchema";

export default function GetSlots() {
  const navigate = useNavigate();
  const selectRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const { token, userName } = useSelector((state) => state.account);
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      selectedDate: "",
      fullName: "",
      doctorId: null,
    },
    validationSchema: appointmentSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await httpClient.get(
          "/Appointment/AvailableTimeSlots",
          {
            params: {
              selectedDate: values.selectedDate,
              doctorId: values.doctorId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        navigate(
          `/schedule?doctorId=${values.doctorId}&selectedDate=${values.selectedDate}`
        );
      } catch (error) {
        console.error("Error fetching available time slots:", error);
        toast({
          title: "Error",
          description:
            error.response.data ||
            "Uppss something went wrong .. check your connection or logout and sign in again",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const next30Days = new Date();
  next30Days.setDate(next30Days.getDate() + 30);

  const getDoctors = (token) => {
    return httpClient.get("/doctor", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  const {
    isLoading: doctorLoading,
    data: doctor,
    error: doctorError,
  } = useQuery(["doctor"], () => getDoctors(), {
    refetchOnWindowFocus: false,
  });

  if (doctorLoading) {
    return <Spinner1 />;
  }
console.log(doctor);
  return (
    <Flex>
      <Box width="15%"></Box>
      <Container maxW="85%">
        {" "}
        <FormControl gap="20px">
          <Flex justifyContent="space-between">
            {formik.errors.doctorId && formik.touched.doctorId && (
              <Text color="red" width="58%">
                {formik.errors.doctorId}
              </Text>
            )}
            {formik.errors.selectedDate && formik.touched.selectedDate && (
              <Text color="red" width="38%">
                {formik.errors.selectedDate}
              </Text>
            )}
          </Flex>
          <Flex
            alignItems="center"
            margin="20px 0 50px"
            justifyContent="space-between"
          >
            <Select
              width="58%"
              ref={selectRef}
              name="doctorId"
              value={formik.values.doctorId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option selected disabled value="default">
                Select Doctor
              </option>
              {doctor?.data?.doctors?.map((x, i) => {
                return (
                  <option key={i} value={x.id}>
                    {x.fullName}
                  </option>
                );
              })}
            </Select>

            <Input
              w="38%"
              size="md"
              type="date"
              name="selectedDate"
              value={formik.values.selectedDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min={tomorrow.toISOString().split("T")[0]}
              max={next30Days.toISOString().split("T")[0]}
            />
          </Flex>

          <Box textAlign="center" margin="0 auto ">
            {" "}
            <Button
              gap="30px"
              justifyContent="center"
              alignItems="center"
              onClick={formik.handleSubmit}
              isLoading={isLoading}
            >
              <Text> Next</Text>
              <FontAwesomeIcon fontSize="28px" icon={faAngleRight} />
            </Button>
          </Box>
        </FormControl>
      </Container>
    </Flex>
  );
}
