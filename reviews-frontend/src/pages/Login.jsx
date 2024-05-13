import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState } from "react";
import axios from "axios";
import Alert from "../components/Alert";
import Fade from '@mui/material/Fade';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate()
  const [state, setState] = useState({
    open: false,
    Transition: Fade,
  })

  const [alertMsg, setAlertMsg] = useState("")

  const handleClick = (message) => {
    setAlertMsg(message)
    setState({
      ...state,
      open: true,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });

    try {
      const res = await axios.post("http://localhost:3000/api/v1/user/signin",{
        email: data.get("email"),
        password: data.get("password"),
      })

      console.log(res.data)
      handleClick(res.data.message)

      localStorage.setItem('google-reviews-jwt-token', res.data.token)

      setTimeout(()=>{
        navigate("/wishlist")
      }, 2000)
    } catch(err){
      console.log(err.response.data.message)
      handleClick(err.response.data.message)
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 6,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Alert msg={alertMsg} setState={setState} state={state}/>
    </Container>
  );
}