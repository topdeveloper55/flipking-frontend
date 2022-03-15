import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";
import {
  Box,
  Button,
  Typography,
  Grid,
  InputBase,
  FormControl,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { useAddress, useWeb3Context } from "src/hooks/web3Context";
import { abi as busdABI } from "../../abi/BUSD.json";
import { abi as usdcABI } from "../../abi/USDC.json";
import { abi as usdceABI } from "../../abi/USDCE.json";
import { abi as realABI } from "../../abi/RealFlip.json";
import { error, success } from "src/slices/MessagesSlice";
import store from "src/store";
import "./style.css";
import Check from "./check.png";
import Logo from "./logo.png";
import bscIcon from "./bsc.png";
import avaxIcon from "./avax.png";
import ftmIcon from "./ftm.png";

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "black",
    color: "white",
  },
  body: {
    fontSize: 18,
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
    minWidth: 700,
  },
});

const bnbID = 56;
const avaxID = 43114;
const ftmID = 250;

const ownerAddress = "0x2B0e9a25c04A1BA08a83Be25E1638544ca71b1B1";

const busdAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
const usdcAddress = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75";
const usdceAddress = "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664";

const bnbAddress = "0x308423A31A9Eed3ddD775a20555452Bf5C76Efc2";
const avaxAddress = "0xBc65fe5fdE971399f8fc9FfC60A349ab0Ad1CD50";
const ftmAddress = "0xABb462ffC8e0cc3C92527Bcf67ccfBE4FCa66549";

const largeApprove = "1000000000000000000000000000";

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
  const [loading, setLoading] = useState(false);
  const [totalWon, setTotalWon] = useState(0);
  const [totalLost, setTotalLost] = useState(0);
  const [info, setInfo] = useState([]);
  const [showApprove, setShowApprove] = useState(false);
  const [rate, setRate] = useState(0);
  const [rateAmount, setRateAmount] = useState("");
  const [startBtn, setStartBtn] = useState(true);

  let buttonText = "Connect Wallet";
  let clickFunc = connect;

  if (isConnected) {
    buttonText = "Disconnect";
    clickFunc = disconnect;
  }

  const isShowOption = id => {
    if (chainID == id) return true;
    else if (chainID != bnbID && chainID != ftmID && chainID != avaxID) return true;
    else return false;
  };

  const chainTxt = () => {
    if (chainID == bnbID) return "BNB";
    else if (chainID == ftmID) return "FTM";
    else if (chainID == avaxID) return "AVAX";
    else return "";
  };

  const getTokenAmount = (amount, isCoin, network) => {
    if (isCoin) return (amount / 1000000000 / 1000000000).toFixed(3);
    else {
      if (network == 0) return (amount / 1000000000 / 1000000000).toFixed(1);
      else return (amount / 1000000).toFixed(1);
    }
  };

  const networkTxt = network => {
    if (network == 0) return "Binance";
    else if (network == 1) return "Avalanche";
    else return "Fantom";
  };

  const handleStart = async () => {
    let mainContract;
    if (chainID == bnbID) mainContract = new ethers.Contract(bnbAddress, realABI, provider.getSigner());
    else if (chainID == ftmID) mainContract = new ethers.Contract(ftmAddress, realABI, provider.getSigner());
    else if (chainID == avaxID) mainContract = new ethers.Contract(avaxAddress, realABI, provider.getSigner());
    try {
      await mainContract.setStarted();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRate = async () => {
    let mainContract;
    if (chainID == bnbID) mainContract = new ethers.Contract(bnbAddress, realABI, provider.getSigner());
    else if (chainID == ftmID) mainContract = new ethers.Contract(ftmAddress, realABI, provider.getSigner());
    else if (chainID == avaxID) mainContract = new ethers.Contract(avaxAddress, realABI, provider.getSigner());

    if (!(Number(rateAmount) >= 0 && Number(rateAmount) <= 100)) {
      window.alert("Invalid Number!(0-100)");
      return;
    }
    try {
      await mainContract.flipCustomToken(Number(rateAmount));
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangeFlip = event => {
    setFlip(event.target.value);
  };

  const getMinTxt = () => {
    if (token == 0) return "0.05 BNB";
    else if (token == 1) return "20 BUSD";
    else if (token == 2) return "0.25 AVAX";
    else if (token == 3) return "20 USDC.e";
    else if (token == 4) return "10 FTM";
    else return "20 USDC";
  };

  const getTokenName = (isCoin, netId) => {
    if (isCoin) {
      if (netId == 0) return " BNB";
      else if (netId == 1) return " AVAX";
      else return " FTM";
    } else {
      if (netId == 0) return " BUSD";
      else if (netId == 1) return " USDC.e";
      else return " USDC";
    }
  };

  const tokenName = token => {
    if (token == 0) return "BNB";
    else if (token == 1) return "BUSD";
    else if (token == 2) return "AVAX";
    else if (token == 3) return "USDC.e";
    else if (token == 4) return "FTM";
    else return "USDC";
  };

  const handleChangeToken = event => {
    setToken(event.target.value);
    if (!connected) return;
    let tokenContract;
    let spenderAddress;
    if (chainID == bnbID) {
      tokenContract = new ethers.Contract(busdAddress, busdABI, provider.getSigner());
      spenderAddress = bnbAddress;
    } else if (chainID == ftmID) {
      tokenContract = new ethers.Contract(usdcAddress, usdcABI, provider.getSigner());
      spenderAddress = ftmAddress;
    } else if (chainID == avaxID) {
      tokenContract = new ethers.Contract(usdceAddress, usdceABI, provider.getSigner());
      spenderAddress = avaxAddress;
    }
    if (event.target.value == 1 || event.target.value == 3 || event.target.value == 5) {
      tokenContract
        .allowance(address, spenderAddress)
        .then(data => {
          if (Number(data) > 0) setShowApprove(false);
          else setShowApprove(true);
        })
        .catch(err => console.error(err));
    } else {
      setShowApprove(false);
    }
  };

  const handleLiquidity = async () => {
    let mainContract;
    if (chainID == bnbID) mainContract = new ethers.Contract(bnbAddress, realABI, provider.getSigner());
    else if (chainID == ftmID) mainContract = new ethers.Contract(ftmAddress, realABI, provider.getSigner());
    else if (chainID == avaxID) mainContract = new ethers.Contract(avaxAddress, realABI, provider.getSigner());
    try {
      await mainContract.pool();
    } catch (e) {
      console.error(e);
    }
  };

  const handleFlip = async () => {
    if (!connected) {
      store.dispatch(error("Please connect to wallet!"));
      return;
    }
    if (token == 1 || token == 3 || token == 5)
      if (!(Number(amount) >= 20)) {
        store.dispatch(error("Invalid Number or Minimum Value Error!"));
        return;
      }
    if (token == 0)
      if (!(Number(amount) >= 0.05)) {
        store.dispatch(error("Invalid Number or Minimum Value Error!"));
        return;
      }
    if (token == 2)
      if (!(Number(amount) >= 0.25)) {
        store.dispatch(error("Invalid Number or Minimum Value Error!"));
        return;
      }
    if (token == 4)
      if (!(Number(amount) >= 10)) {
        store.dispatch(error("Invalid Number or Minimum Value Error!"));
        return;
      }

    let mainContract;
    if (chainID == bnbID) mainContract = new ethers.Contract(bnbAddress, realABI, provider.getSigner());
    else if (chainID == ftmID) mainContract = new ethers.Contract(ftmAddress, realABI, provider.getSigner());
    else if (chainID == avaxID) mainContract = new ethers.Contract(avaxAddress, realABI, provider.getSigner());

    const randNum = Math.floor(Math.random() * 100);
    // console.log(randNum);
    setLoading(true);
    try {
      if (token == 0 || token == 2 || token == 4) {
        let res = await mainContract.flipCoin(
          ethers.utils.parseUnits(amount),
          (randNum * 2) % 100,
          randNum,
          (randNum * 3) % 100,
          {
            value: ethers.utils.parseUnits(amount),
          },
        );
        await res.wait();
        let data = await mainContract.flipResult(address);
        if (data)
          store.dispatch(success(`Congratulations! You won ${(3 * Number(amount)).toFixed(4)} ${tokenName(token)}`));
        else store.dispatch(error(`Sorry, you lost!`));
        setLoading(false);
      } else {
        let res;
        if (token == 1)
          res = await mainContract.flipToken(
            ethers.utils.parseUnits(amount),
            (randNum * 2) % 100,
            randNum,
            (randNum * 3) % 100,
          );
        else
          res = await mainContract.flipToken(
            Number(amount) * 100000 + "0",
            (randNum * 2) % 100,
            randNum,
            (randNum * 3) % 100,
          );
        await res.wait();
        let data = await mainContract.flipResult(address);
        if (data) store.dispatch(success(`Congratulations! You won ${3 * Number(amount)} ${tokenName(token)}`));
        else store.dispatch(error(`Sorry, you lost!`));
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!connected) {
      store.dispatch(error("Please connect to wallet!"));
      return;
    }
    let tokenContract;
    let spenderAddress;
    if (chainID == bnbID) {
      tokenContract = new ethers.Contract(busdAddress, busdABI, provider.getSigner());
      spenderAddress = bnbAddress;
    } else if (chainID == ftmID) {
      tokenContract = new ethers.Contract(usdcAddress, usdcABI, provider.getSigner());
      spenderAddress = ftmAddress;
    } else if (chainID == avaxID) {
      tokenContract = new ethers.Contract(usdceAddress, usdceABI, provider.getSigner());
      spenderAddress = avaxAddress;
    }
    try {
      let res = await tokenContract.approve(spenderAddress, largeApprove);
      await res.wait();
      let data = await tokenContract.allowance(address, spenderAddress);
      if (Number(data > 0)) setShowApprove(false);
      else setShowApprove(true);
    } catch (e) {
      console.error(e);
    }
  };

  const flipBtnTxt = () => {
    if (token == 0) return "Flip With BNB";
    else if (token == 1) return "Flip With BUSD";
    else if (token == 2) return "Flip With AVAX";
    else if (token == 3) return "Flip With USDC.e";
    else if (token == 4) return "Flip With FTM";
    else return "Flip With USDC";
  };

  const timeForAgo = time => {
    const currentTime = Math.floor(Date.now() / 1000);
    const diff = currentTime - time;
    if (diff < 5) return "5 seconds ago";
    else if (diff < 60) return diff + " seconds ago";
    else if (diff < 3600) return Math.floor(diff / 60) + " minutes ago";
    else if (diff < 86400) return Math.floor(diff / 3600) + " hours ago";
    else return Math.floor(diff / 86400) + " days ago";
  };

  const app1 = async () => {
    const bnbProvider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/"); // https://bsc-dataseed.binance.org/
    const avaxProvider = new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc"); // https://api.avax.network/ext/bc/C/rpc
    const ftmProvider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools"); // https://rpc.ftm.tools
    const bnbContract = new ethers.Contract(bnbAddress, realABI, bnbProvider);
    const ftmContract = new ethers.Contract(ftmAddress, realABI, ftmProvider);
    const avaxContract = new ethers.Contract(avaxAddress, realABI, avaxProvider);
    try {
      let bnbData = await bnbContract.totalWinners();
      let ftmData = await ftmContract.totalWinners();
      let avaxData = await avaxContract.totalWinners();
      setTotalWon(Number(bnbData) + Number(ftmData) + Number(avaxData));

      bnbData = await bnbContract.totalLosers();
      ftmData = await ftmContract.totalLosers();
      avaxData = await avaxContract.totalLosers();
      setTotalLost(Number(bnbData) + Number(ftmData) + Number(avaxData));
    } catch (e) {
      console.error(e);
    }
  };

  const app2 = async () => {
    const bnbProvider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/"); // https://bsc-dataseed.binance.org/
    const bnbContract = new ethers.Contract(bnbAddress, realABI, bnbProvider);
    const ftmProvider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools"); // https://rpc.ftm.tools
    const ftmContract = new ethers.Contract(ftmAddress, realABI, ftmProvider);
    const avaxProvider = new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc"); // https://api.avax.network/ext/bc/C/rpc
    const avaxContract = new ethers.Contract(avaxAddress, realABI, avaxProvider);
    let buf = [];
    try {
      for (let i = 0; i < 5; i++) {
        let data = await bnbContract.info(i);
        buf.push(data);
      }
      for (let i = 0; i < 5; i++) {
        let data = await ftmContract.info(i);
        buf.push(data);
      }
      for (let i = 0; i < 5; i++) {
        let data = await avaxContract.info(i);
        buf.push(data);
      }
      buf = buf.filter(item => Number(item.time) != 0);
      buf.sort((item1, item2) => {
        if (Number(item1.time) < Number(item2.time)) return 1;
        else return -1;
      });
      setInfo(buf.slice(0, 5));
    } catch (e) {
      console.error(e);
    }
  };

  const app3 = async () => {
    if (!connected) return;
    let mainContract;
    if (chainID == bnbID) mainContract = new ethers.Contract(bnbAddress, realABI, provider.getSigner());
    else if (chainID == ftmID) mainContract = new ethers.Contract(ftmAddress, realABI, provider.getSigner());
    else if (chainID == avaxID) mainContract = new ethers.Contract(avaxAddress, realABI, provider.getSigner());
    try {
      let data = await mainContract.started();
      if (data) setStartBtn(false);
      else setStartBtn(true);

      data = await mainContract.rate();
      setRate(Number(data));
    } catch (e) {
      console.error(e);
    }
  };

  const app4 = async () => {
    // const avaxProvider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc"); // https://api.avax.network/ext/bc/C/rpc
  };

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  useEffect(() => {
    if (chainID == bnbID) setToken(0);
    else if (chainID == avaxID) setToken(2);
    else if (chainID == ftmID) setToken(4);
  }, [chainID]);

  useEffect(() => {
    // set timeinterval 1
    if (timeInterval1) {
      clearInterval(timeInterval1);
      timeInterval1 = setInterval(() => {
        app1();
      }, 3000);
    } else
      timeInterval1 = setInterval(() => {
        app1();
      }, 3000);
    // set timeinterval 2
    if (timeInterval2) {
      clearInterval(timeInterval2);
      timeInterval2 = setInterval(() => {
        app2();
      }, 3000);
    } else
      timeInterval2 = setInterval(() => {
        app2();
      }, 3000);
    // set timeinterval 3
    if (timeInterval3) {
      clearInterval(timeInterval3);
      timeInterval3 = setInterval(() => {
        app3();
      }, 3000);
    } else
      timeInterval3 = setInterval(() => {
        app3();
      }, 3000);
    // set timeinterval 4
    if (timeInterval4) {
      clearInterval(timeInterval4);
      timeInterval4 = setInterval(() => {
        app4();
      }, 3000);
    } else
      timeInterval4 = setInterval(() => {
        app4();
      }, 3000);
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
    <Box className="background-image" style={{ padding: "20px 30px 50px", position: "relative" }}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={11} style={{ padding: "10px" }}>
          <Box display="flex" alignItems="center" justifyContent="flex-end" className="header-bar">
            <img src={Logo} alt="Logo" style={{ position: "absolute", left: "40px", height: "100px" }} />
            <Box sx={{ margin: "0px 20px", color: "white" }}>
              <Typography>
                {address
                  ? `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`
                  : "No Balance"}
              </Typography>
            </Box>
            <Typography style={{ color: "white", marginRight: "20px" }}>{chainTxt()}</Typography>
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

      {address == ownerAddress && (
        <Grid container justifyContent="center" alignItems="center" style={{ marginBottom: "20px" }}>
          <Grid item sm={12} md={12}>
            <Box textAlign="center" style={{ color: "#F0C725" }}>
              <Typography variant="h2" style={{ marginBottom: "20px" }}>
                Set WinRate
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Box className="card-box" textAlign="center">
                <Typography variant="h3">{rate}</Typography>
                <Typography variant="h6">Current Rate</Typography>
              </Box>
              <Box className="card-box" textAlign="center">
                <InputBase
                  fullWidth
                  style={{
                    fontSize: "20px",
                    borderRadius: "5px",
                    backgroundColor: "#F0C725",
                    border: "1px solid black",
                    marginBottom: "10px",
                  }}
                  placeholder="Enter Rate(0-100)"
                  onChange={ev => setRateAmount(ev.target.value)}
                />
                <Button className="display-button" onClick={handleRate}>
                  Set
                </Button>
              </Box>
              <Button className="pool-button" onClick={handleLiquidity}>
                Liquidity
              </Button>
              {startBtn && (
                <Button className="pool-button" onClick={handleStart}>
                  Start
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      )}

      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item sm={12} md={6}>
          <Box textAlign="center" className="card-box">
            <Typography variant="h2" style={{ marginBottom: "15px" }}>
              Luck Your Flip
            </Typography>
            <Box style={{ padding: "8px", marginBottom: "10px" }}>
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

            <Box style={{ padding: "8px", marginBottom: "10px" }}>
              <Box textAlign="left" style={{ paddingLeft: "10px" }}>
                <Typography variant="h5">Select Network</Typography>
              </Box>
              <FormControl variant="outlined" style={{ width: "100%" }}>
                <Select fullWidth native value={token} onChange={handleChangeToken} style={{ fontSize: "20px" }}>
                  {isShowOption(bnbID) && (
                    <option value={0} style={{ fontSize: "20px", backgroundColor: "#F0C725" }}>
                      BNB(Binance Smart Chain)
                    </option>
                  )}
                  {isShowOption(bnbID) && (
                    <option value={1} style={{ fontSize: "20px", backgroundColor: "#F0C725" }}>
                      BUSD(Binance Smart Chain)
                    </option>
                  )}
                  {isShowOption(avaxID) && (
                    <option value={2} style={{ fontSize: "20px", backgroundColor: "#F0C725" }}>
                      AVAX(Avalanche Network)
                    </option>
                  )}
                  {isShowOption(avaxID) && (
                    <option value={3} style={{ fontSize: "20px", backgroundColor: "#F0C725" }}>
                      USDC.e(Avalanche Network)
                    </option>
                  )}
                  {isShowOption(ftmID) && (
                    <option value={4} style={{ fontSize: "20px", backgroundColor: "#F0C725" }}>
                      FTM(Fantom Network)
                    </option>
                  )}
                  {isShowOption(ftmID) && (
                    <option value={5} style={{ fontSize: "20px", backgroundColor: "#F0C725" }}>
                      USDC(Fantom Network)
                    </option>
                  )}
                </Select>
              </FormControl>
            </Box>

            <Box style={{ padding: "8px", marginBottom: "10px" }}>
              <InputBase
                fullWidth
                style={{ fontSize: "20px", borderRadius: "5px", backgroundColor: "#F0C725", border: "1px solid black" }}
                placeholder="Enter Amount"
                onChange={ev => setAmount(ev.target.value)}
              />
              <Box textAlign="left">
                <Typography variant="h6">Minimum For Flip {getMinTxt()}</Typography>
              </Box>
            </Box>
            {showApprove && (
              <Typography variant="h6">If you are the first time with this token, first approve.</Typography>
            )}
            <Box display="flex" justifyContent="space-around" style={{ padding: "8px", marginBottom: "20px" }}>
              {showApprove && (
                <Button className="display-button" onClick={handleApprove}>
                  Approve
                </Button>
              )}
              <Button className="display-button" onClick={handleFlip}>
                {flipBtnTxt()}
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item sm={12} md={6}>
          <Box textAlign="center" style={{ color: "#F0C725" }}>
            <Typography variant="h2" style={{ marginBottom: "20px" }}>
              Support Chains
            </Typography>
          </Box>
          <Box display="flex" textAlign="center" justifyContent="space-around" style={{ marginBottom: "30px" }}>
            <Box style={{ marginBottom: "10px" }}>
              <img src={bscIcon} alt="BNB" style={{ height: "50px" }} />
              <Typography variant="h5" style={{color: "white"}}>Binance</Typography>
            </Box>
            <Box style={{ marginBottom: "10px" }}>
              <img src={avaxIcon} alt="BNB" style={{ height: "50px" }} />
              <Typography variant="h5" style={{color: "white"}}>Avalanche</Typography>
            </Box>
            <Box style={{ marginBottom: "10px" }}>
              <img src={ftmIcon} alt="BNB" style={{ height: "50px" }} />
              <Typography variant="h5" style={{color: "white"}}>Fantom</Typography>
            </Box>
          </Box>
          <Box textAlign="center" style={{ color: "#F0C725" }}>
            <Typography variant="h2" style={{ marginBottom: "20px" }}>
              Global Status
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-around">
            <Box className="card-box" textAlign="center">
              <Typography variant="h3">{totalLost + totalWon}</Typography>
              <Typography variant="h6">Total Flips</Typography>
            </Box>
            <Box className="card-box" textAlign="center">
              <Typography variant="h3">{totalWon}</Typography>
              <Typography variant="h6">Won</Typography>
            </Box>
            <Box className="card-box" textAlign="center">
              <Typography variant="h3">{totalLost}</Typography>
              <Typography variant="h6">Lost</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container justifyContent="center" alignItems="center" style={{ marginTop: "60px" }}>
        <Grid item xs={12}>
          <Box className="card-box" textAlign="center">
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
                  {info.map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell component="th" scope="row">
                        {`${item.user.slice(0, 6)}...${item.user.slice(item.user.length - 4, item.user.length)}`}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {getTokenAmount(Number(item.amount), item.isCoin, Number(item.network))}
                        {getTokenName(item.isCoin, Number(item.network))}
                      </StyledTableCell>
                      <StyledTableCell align="center">{networkTxt(Number(item.network))}</StyledTableCell>
                      <StyledTableCell align="center">{timeForAgo(Number(item.time))}</StyledTableCell>
                      <StyledTableCell align="center" style={{ color: item.winStatus ? "green" : "red" }}>
                        {item.winStatus ? "Win" : "Lose"}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>

      <Grid container justifyContent="center" alignItems="center">
        <Grid item sm={12} md={10}>
          <Typography variant="h2" style={{ color: "#F0C725", marginTop: "60px", marginBottom: "20px" }}>
            How to Play Lucky Flip?
          </Typography>
          <Box style={{ color: "white" }}>
            <Typography variant="h5" style={{ marginBottom: "10px" }}>
              <b style={{ color: "#F0C725" }}>1.</b> You can click the flip button to start random flipping
            </Typography>
            <hr style={{ marginBottom: "10px" }} />
            <Typography variant="h5" style={{ marginBottom: "10px" }}>
              <b style={{ color: "#F0C725" }}>2.</b> Select your flip, select the deposit currency, amount and then
              click on flip button. If you are the first time with the token, first approve before clicking on flip
              button. Once transaction confirmed on chain, you will get your flip result.
            </Typography>
            <hr style={{ marginBottom: "10px" }} />
            <Typography variant="h5" style={{ marginBottom: "10px" }}>
              <b style={{ color: "#F0C725" }}>3.</b> The result of the coin flip will be shown
            </Typography>
            <hr style={{ marginBottom: "10px" }} />
            <Typography variant="h5" style={{ marginBottom: "10px" }}>
              <b style={{ color: "#F0C725" }}>4.</b> The result will contribute to our world and your own statistics of
              heads or tails probability.
            </Typography>
            <hr style={{ marginBottom: "10px" }} />
            <Typography variant="h5" style={{ marginBottom: "10px" }}>
              <b style={{ color: "#F0C725" }}>5.</b> Predict right side of the coin. Heads or Tails, you have 50% chance
              to win 3x, if you are lucky.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {loading && (
        <Box className="loading">
          <CircularProgress style={{ color: "aqua" }} />
        </Box>
      )}
    </Box>
  );
}

export default ConnectMenu;
