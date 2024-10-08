import * as Yup from "yup";

const doctorRegisterSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  departmentId: Yup.string().required("Department ID is required"),
  doctorTypeId: Yup.string().required("Doctor Type ID is required"),
  photo: Yup.mixed().required("Photo is required"),

  password: Yup.string()
    .min(3, "Password must be at least 3 characters")
    .max(20, "Password must not exceed 20 characters")
    .required("Password is required"),

    
    phoneNumber: Yup.string().required("Phone Number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    birthDate: Yup.date()
    .max(new Date(), "Birth Date cannot be in the future")
    .required("Birth Date is required")
    .test("age", "User must be at least 25 years old", function(value) {
      const currentDate = new Date();
      const userDate = new Date(value);
      const userAge = currentDate.getFullYear() - userDate.getFullYear();
      const isUnder25 = userAge < 24;
      return !isUnder25;
    }),


    startTime: Yup.string().required("Start Time is required"),
    endTime: Yup.string().required("End Time is required"),
    roomNumber: Yup.string().required("Room Number is required"),
});
export default doctorRegisterSchema;
