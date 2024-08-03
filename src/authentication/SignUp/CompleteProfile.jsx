import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../components/Core/Input";
import Button from "../../components/Core/Button";
import Load from "../../microInteraction/Load/Load";
import styles from "./style/CompleteProfile.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AuthContext from "../../context/AuthContext";
import { Alert, MicroLoading } from "../../microInteraction";
import { api } from "../../services";

function CompleteProfile() {
  const [loadingEffect, setLoad] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [year, setYear] = useState("");
  const [showUser, setUser] = useState({
    email: "",
    name: "",
    RollNumber: "",
    School: "",
    College: "",
    MobileNo: "",
    img: "",
    year: "",
  });
  const [errors, setErrors] = useState({});

  const authCtx = useContext(AuthContext);
  const location = useLocation();

  const userData = location.state?.data || {};
  const { name = "", email = "", picture: img = "" } = userData;

  const validate = () => {
    const newErrors = {};
    if (!showUser.RollNumber) newErrors.RollNumber = "Roll Number is required";
    if (!showUser.School) newErrors.School = "School is required";
    if (!showUser.College) newErrors.College = "College is required";
    if (!showUser.MobileNo || !/^\d{10}$/.test(showUser.MobileNo)) newErrors.MobileNo = "Enter a valid 10-digit Mobile Number";
    if (!year) newErrors.year = "Year is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const options = [
    { value: "1st", text: "1st year" },
    { value: "2nd", text: "2nd year" },
    { value: "3rd", text: "3rd year" },
    { value: "4th", text: "4th year" },
    { value: "5th", text: "5th year" },
    { value: "Passout", text: "Passout" },
  ];

  useEffect(() => {
    setAlert({
      type: "info",
      message: "Kindly complete your profile for registration",
      position: "bottom-right",
      duration: 3000,
    });
  }, []);

  useEffect(() => {
    if (alert) {
      const { type, message, position, duration } = alert;
      Alert({ type, message, position, duration });
    }
  }, [alert]);

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const { RollNumber, School, College, MobileNo } = showUser;

    const userObject = {
      name,
      email,
      img,
      RollNumber,
      School,
      College,
      MobileNo,
      year,
    };

    try {
      // API call
      const response = await api.post("/api/auth/register", userObject);
      if (response.status === 200 || response.status === 201) {

        setAlert({
          type: "success",
          message: "Profile created successfully",
          position: "bottom-right",
          duration: 3000,
        });

        setTimeout(() => {
          authCtx.login(
            userObject.name,
            userObject.email,
            userObject.img,
            userObject.RollNumber,
            userObject.School,
            userObject.College,
            userObject.MobileNo,
            userObject.year,
            userObject.github,
            userObject.linkedin,
            userObject.designation,
            userObject.regForm,
            "USER",
            "someToken",
            7200000
          );
          navigate("/");
        }, 3000);

        
      } else {
        setAlert({
          type: "error",
          message: response.data.message || "An error occurred",
          position: "bottom-right",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error during profile creation:", error);
      setAlert({
        type: "error",
        message: "An error occurred while creating your profile. Please try again.",
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.mDiv}>
      <div className={styles.mDivCon}>
        <div className={styles.ArrowBackIcon} onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </div>
        <div className={styles.circle}></div>
        <div className={styles.circle1}></div>
        <div className={styles.BackGround}>
          <div>
            <p
              className={styles.CreateProfile}
              style={{
                background: "var(--primary)",
                padding: "5px 0px 5px 0px",
                WebkitBackgroundClip: "text",
                color: "transparent",
                alignItems: "center",
              }}
            >
              Create Profile
            </p>
            <p className={styles.Please}>Please enter Your Details</p>
          </div>

          <form className={styles.FormTag} onSubmit={handleCreateProfile}>
            <Input
              type="text"
              placeholder="Enter Roll Number"
              label="Roll Number"
              name="RollNumber"
              onChange={(e) => setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
              required
              style={{ width: "100%" }}
              error={errors.RollNumber}
            />

            <Input
              type="select"
              placeholder="Select Year"
              label="Year"
              name="year"
              options={options.map(option => ({ label: option.text, value: option.value }))}
              value={year}
              onChange={(value) => setYear(value)}
              required
              style={{ width: "100%" }}
              error={errors.year}
            />

            <Input
              type="text"
              placeholder="Enter School"
              label="School"
              name="School"
              onChange={(e) => setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
              required
              style={{ width: "100%" }}
              error={errors.School}
            />

            <Input
              type="select"
              placeholder="Select College"
              label="College"
              name="College"
              options={[
                {
                  label: "Kalinga Institute of Industrial Technology",
                  value: "Kalinga Institute of Industrial Technology",
                },
              ]}
              value={showUser.College}
              onChange={(value) => setUser((prev) => ({ ...prev, College: value }))}
              required
              style={{ width: "96%" }}
              error={errors.College}
            />

            <Input
              type="number"
              placeholder="Enter Mobile Number"
              label="Mobile"
              name="MobileNo"
              onChange={(e) => setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
              required
              style={{ width: "100%" }}
              error={errors.MobileNo}
            />

            <div style={{ marginLeft: "8px" }}>
              <Button
                style={{
                  width: "102%",
                  background: "var(--primary)",
                  color: "#fff",
                  height: "40px",
                  marginTop: "20px",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
                type="submit"
              >
                {isLoading ? <MicroLoading /> : "Create Profile"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Alert />
    </div>
  );
}

CompleteProfile.propTypes = {
  data: PropTypes.object,
  set: PropTypes.func,
};

export default CompleteProfile;
