import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { signUp } from "../../store/user/actions";
import { selectToken } from "../../store/user/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Col } from "react-bootstrap";
import useGeolocation from "../../hooks/useGeolocation";
import { setMessage } from "../../store/appState/actions";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const location = useGeolocation();

  useEffect(() => {
    if (token !== null) {
      navigate("/activities");
    }
  }, [token, navigate]);

  function submitForm(event) {
    event.preventDefault();
    if (location.error && location.error.code === 0) {
      console.log("code 0", location);
      dispatch(setMessage("danger", true, location.error.message));
      setEmail("");
      setPassword("");
      setName("");
    } else if (location.error && location.error.code === 1) {
      dispatch(
        setMessage(
          "danger",
          true,
          "In order to use Moody you need to enable your location"
        )
      );
      setEmail("");
      setPassword("");
      setName("");
    } else {
      const lat = location.coordinates.lat;
      const lng = location.coordinates.lng;
      dispatch(signUp(name, email, password, lat, lng));
      setEmail("");
      setPassword("");
      setName("");
    }
  }

  return (
    <Container>
      <Form as={Col} md={{ span: 6, offset: 3 }} className="mt-5">
        <h1 className="mt-5 mb-5">Signup</h1>
        <Form.Group controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(event) => setName(event.target.value)}
            type="text"
            placeholder="Enter name"
            required
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Enter email"
            required
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
            required
          />
        </Form.Group>
        <Form.Group className="mt-5">
          <Button variant="primary" type="submit" onClick={submitForm}>
            Sign up
          </Button>
        </Form.Group>
        <Link to="/">Click here to log in</Link>
      </Form>
    </Container>
  );
}
