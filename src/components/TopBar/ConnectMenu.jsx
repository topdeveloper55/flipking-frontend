import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";
import {
  Box,
  Button,
  Typography,
  Grid,
  InputBase,
  SvgIcon,
  Link,
  Slider,
  Modal,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import { ReactComponent as Discord } from "../../assets/icons/discord.svg";
import { ReactComponent as Telegram } from "../../assets/icons/telegram.svg";
import { abi as busdABI } from "../../abi/BUSD.json";
import { abi as bankABI } from "../../abi/BusdBank.json";
import { abi as preABI } from "../../abi/preContract.json";
import "./style.css";
import Check from "./check.png";
import Logo from "./logo.png";

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "black",
    color: "white",
  },
  body: {
    fontSize: 16,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 550,
  },
});

const ownerAddress = "0x8C68B60a606df348baaCe383F5EF10FDC45b3495";
const busdAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
const bankAddress = "0xFf2Ab23a6C3Fe9433c7Ba3EA437B03Dbdaa1DEe2";
const preAddress = "0x3c72F680bcb744E7c546abdA3191423a3fb3bc09";
const zeroAddress = "0x0000000000000000000000000000000000000000";

let timeInterval1;
let timeInterval2;
let timeInterval3;
let timeInterval4;

function ConnectMenu() {
  const { search } = useLocation();
  const classes = useStyles();

  const { connect, disconnect, hasCachedProvider, provider, chainID, connected, uri, web3 } = useWeb3Context();
  const address = useAddress();
  const [isConnected, setConnected] = useState(connected);
  const [flip, setFlip] = useState(0);
  const [token, setToken] = useState(0);
  const [amount, setAmount] = useState("");

  let buttonText = "Connect Wallet";
  let clickFunc = connect;

  if (isConnected) {
    buttonText = "Disconnect";
    clickFunc = disconnect;
  }

  const handleChangeFlip = event => {
    setFlip(event.target.value);
  };

  const handleChangeToken = event => {
    setToken(event.target.value);
  };

  const app1 = async () => {
    console.log("Hello");
  };

  const app2 = async () => {
    console.log("Hello");
  };

  const app3 = async () => {
    console.log("Hello");
  };

  const app4 = async () => {
    console.log("Hello");
  };

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  useEffect(() => {
    // set timeinterval 1
    if (timeInterval1) {
      clearInterval(timeInterval1);
      timeInterval1 = setInterval(() => {
        app1();
      }, 2000);
    } else
      timeInterval1 = setInterval(() => {
        app1();
      }, 2000);
    // set timeinterval 2
    if (timeInterval2) {
      clearInterval(timeInterval2);
      timeInterval2 = setInterval(() => {
        app2();
      }, 2000);
    } else
      timeInterval2 = setInterval(() => {
        app2();
      }, 2000);
    // set timeinterval 3
    if (timeInterval3) {
      clearInterval(timeInterval3);
      timeInterval3 = setInterval(() => {
        app3();
      }, 2000);
    } else
      timeInterval3 = setInterval(() => {
        app3();
      }, 2000);
    // set timeinterval 4
    if (timeInterval4) {
      clearInterval(timeInterval4);
      timeInterval4 = setInterval(() => {
        app4();
      }, 2000);
    } else
      timeInterval4 = setInterval(() => {
        app4();
      }, 2000);
  }, [connected, address]);

  useEffect(() => {
    return () => {
      if (timeInterval1) clearInterval(timeInterval1);
      if (timeInterval2) clearInterval(timeInterval2);
      if (timeInterval3) clearInterval(timeInterval3);
      if (timeInterval4) clearInterval(timeInterval4);
    };
  }, []);

  return (
    <Box className="background-image" style={{ paddingBottom: "50px" }}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={11} style={{ padding: "10px" }}>
          <Box display="flex" alignItems="center" justifyContent="flex-end" className="header-bar">
            <img src={Logo} alt="Logo" style={{ position: "absolute", left: "40px", width: "60px", height: "60px" }} />
            {/* {address == ownerAddress && (
            <Button
              className={started ? "disable-button" : "display-button"}
              disabled={started}
              style={{ marginRight: "30px" }}
              onClick={handleStart}
            >
              Start
            </Button>
          )}
          {address == ownerAddress && (
            <Button className="display-button" style={{ marginRight: "30px" }} onClick={handleOwnerWithdraw}>
              Withdraw
            </Button>
          )} */}
            <Box sx={{ margin: "0px 20px", color: "white" }}>
              <Typography>
                {address
                  ? `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`
                  : "No Balance"}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={clickFunc}
              style={{
                backgroundColor: "#F0C725",
                borderRadius: "10px",
                padding: "20px",
                marginRight: "50px",
                color: "black",
              }}
            >
              {buttonText}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Grid container justifyContent="center" alignItems="center">
        <Grid item sm={12} md={5}>
          <Box textAlign="center" className="card-box">
            <Typography variant="h2" style={{ marginBottom: "25px" }}>
              Luck Your Flip
            </Typography>
            <Box style={{ padding: "8px", marginBottom: "20px" }}>
              <Box textAlign="left" style={{ paddingLeft: "10px" }}>
                <Typography variant="h5">Select Your Flip</Typography>
              </Box>
              <FormControl variant="outlined" style={{ width: "100%" }}>
                <Select fullWidth native value={flip} onChange={handleChangeFlip} style={{ fontSize: "20px" }}>
                  <option value={0} style={{ fontSize: "20px", backgroundColor: "#F0C725" }}>
                    Heads
                  </option>
                  <option value={1} style={{ fontSize: "20px", backgroundColor: "#F0C725" }}>
                    Tails
                  </option>
                </Select>
              </FormControl>
            </Box>

            <Box style={{ padding: "8px", marginBottom: "20px" }}>
              <Box textAlign="left" style={{ paddingLeft: "10px" }}>
                <Typography variant="h5">Select Network</Typography>
              </Box>
              <FormControl variant="outlined" style={{ width: "100%" }}>
                <Select fullWidth native value={token} onChange={handleChangeToken} style={{ fontSize: "20px" }}>
                  <option value={0} style={{ fontSize: "20px", backgroundColor: "#F0C725" }}>
                    BNB(Binance Smart Chain)
                  </option>
                  <option value={1} style={{ fontSize: "20px", backgroundColor: "#F0C725" }}>
                    BUSD(Binance Smart Chain)
                  </option>
                  <option value={2} style={{ fontSize: "20px", backgroundColor: "#F0C725" }}>
                    AVAX(Avalanche Network)
                  </option>
                  <option value={3} style={{ fontSize: "20px", backgroundColor: "#F0C725" }}>
                    USDC.e(Avalanche Network)
                  </option>
                  <option value={4} style={{ fontSize: "20px", backgroundColor: "#F0C725" }}>
                    FTM(Fantom Network)
                  </option>
                  <option value={5} style={{ fontSize: "20px", backgroundColor: "#F0C725" }}>
                    USDC(Fantom Network)
                  </option>
                </Select>
              </FormControl>
            </Box>

            <Box style={{ padding: "8px", marginBottom: "20px" }}>
              <InputBase
                fullWidth
                style={{ fontSize: "20px", borderRadius: "5px", backgroundColor: "#F0C725", border: "1px solid black" }}
                placeholder="Enter Amount"
                onChange={ev => setAmount(ev.target.value)}
              />
              <Box textAlign="left">
                <Typography variant="h6">Minimum For Flip 0.2 BNB</Typography>
              </Box>
            </Box>
            <Typography variant="h6">If you are the first time with this token, first approve.</Typography>
            <Box display="flex" justifyContent="space-around" style={{ padding: "8px", marginBottom: "20px" }}>
              <Button className="display-button">Approve</Button>
              <Button className="display-button">Flip With BNB</Button>
            </Box>
          </Box>
        </Grid>

        <Grid item sm={12} md={7}>
          <Box className="card-box" textAlign="center" style={{ height: "530px" }}>
            <Typography variant="h2" style={{ marginBottom: "25px" }}>
              Latest Results
            </Typography>
            <TableContainer component={Paper} style={{ backgroundColor: "#F0C725" }}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Address</StyledTableCell>
                    <StyledTableCell align="center">Amount</StyledTableCell>
                    <StyledTableCell align="center">Network</StyledTableCell>
                    <StyledTableCell align="center">Time</StyledTableCell>
                    <StyledTableCell align="center">Status</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell component="th" scope="row">
                      0xf8c...211
                    </StyledTableCell>
                    <StyledTableCell align="center">100 BUSD</StyledTableCell>
                    <StyledTableCell align="center">Binance</StyledTableCell>
                    <StyledTableCell align="center">18 seconds ago</StyledTableCell>
                    <StyledTableCell align="center">lose</StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>

      <Grid container justifyContent="center" alignItems="center">
        <Grid item sm={12} md={9}>
          <Box textAlign="center" style={{ color: "#F0C725", marginTop: "60px", marginBottom: "10px" }}>
            <Typography variant="h2">Global Status</Typography>
          </Box>
          <Box display="flex" justifyContent="center">
            <Box className="card-box" textAlign="center">
              <Typography variant="h3">431352</Typography>
              <Typography variant="h6">Total Flips</Typography>
            </Box>
            <Box className="card-box" textAlign="center">
              <Typography variant="h3">123124</Typography>
              <Typography variant="h6">Won</Typography>
            </Box>
            <Box className="card-box" textAlign="center">
              <Typography variant="h3">123124</Typography>
              <Typography variant="h6">Lost</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container justifyContent="center" alignItems="center">
        <Grid item sm={12} md={9}>
          <Typography variant="h2" style={{ color: "#F0C725", marginTop: "60px", marginBottom: "20px" }}>
            How to Play Lucky Flip?
          </Typography>
          <Box style={{ color: "white" }}>
            <Typography variant="h5" style={{ marginBottom: "10px" }}>
              1. You can click the flip button to start random flipping
            </Typography>
            <hr style={{ marginBottom: "10px" }} />
            <Typography variant="h5" style={{ marginBottom: "10px" }}>
              2. Select your flip, select the deposit currency, amount and then click on flip button.
              If you are the first time with the token, first approve before clicking on flip button.
              Onec transaction confirmed on chain, you will get your flip result.
            </Typography>
            <hr style={{ marginBottom: "10px" }} />
            <Typography variant="h5" style={{ marginBottom: "10px" }}>
              3. The result of the coin flip will be shown
            </Typography>
            <hr style={{ marginBottom: "10px" }} />
            <Typography variant="h5" style={{ marginBottom: "10px" }}>
              4. The result will contribute to our world and your own statistics of heads or tails probability.
            </Typography>
            <hr style={{ marginBottom: "10px" }} />
            <Typography variant="h5" style={{ marginBottom: "10px" }}>
              5. Predict right side of the coin. Heads or Tails, you have 50% chance to win 2x, if you are lucky.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ConnectMenu;
