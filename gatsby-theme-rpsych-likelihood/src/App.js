import React, { useReducer, useState, useEffect, createContext } from "react";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import HeaderAppBar from "./components/navigation/HeaderAppBar";
import SettingsDrawer from "./components/navigation/SettingsDrawer";
import Faq from "./components/content/FAQ";
import MoreViz from "./components/content/MoreViz";
import theme from "./theme.js";
import TwitterIcon from "@material-ui/icons/Twitter";
import IntroText from "./components/content/Intro";
import Posters from "./components/content/Posters";
import Contribute from "./components/content/Contribute";
import Button from "@material-ui/core/Button";
import Content from "./Viz";
import SEO from "./components/SEO";
import Footer from "./components/content/Footer";
import { randomNormal } from "d3-random";
import { calcMean, calcSS } from "./components/utils";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  },
  textContent: {
    maxWidth: 700
  },
  siteTitle: {
    margin: theme.spacing(10, 0, 5)
  },
  siteSubTitle: {
    margin: theme.spacing(0, 0, 5)
  },
  twitter: {
    textTransform: "none"
  }
}));

const initialState = {
  mu: 80,
  muNull: 80,
  muTheta: 100,
  muHat: "",
  SS: "",
  sigma2: 100,
  sigma2Max: 650,
  sigma2Theta: 225,
  sigma2MleNull: "",
  sigma2Hat: "",
  n: 10,
  test: "LRT",
  sample: [1, 2],
  sliderMax: 150,
  sliderStep: 0.1
};

const vizReducer = (state, action) => {
  let { name, value } = action;
  value = value === "" ? "" : action.value;

  switch (name) {
    case "sigma2":
    case "mu": {
      return {
        ...state,
        [name]: round(value)
      };
    }
    case "sample": {
      const muHat = calcMean(value);
      const SS = calcSS(value, muHat);
      const n = value.length;
      const sigma2Hat = SS * (1 / n);
      const SSnull = calcSS(value, state.muNull);
      const sigma2Null = SSnull * (1 / n);
      return {
        ...state,
        sample: value,
        muHat: muHat,
        sigma2Hat: sigma2Hat,
        sigma2MleNull: sigma2Null,
        SS: SS
      };
    }
    case "muNull": {
      const SS = calcSS(state.sample, value);
      const sigma2Hat = SS * (1 / 10);
      return {
        ...state,
        sigma2MleNull: sigma2Hat,
        muNull: value
      };
    }
    case "n":
    case "test":
    case "xLabel":
    case "muZeroLabel":
    case "muOneLabel":
    case "sliderMax":
    case "sliderStep":
      return {
        ...state,
        [name]: value
      };
  }
};
export const VizDispatch = createContext(null);
export const drawSample = (n, M, sigma2) =>
  [...Array(n)].map(() => randomNormal(M, Math.sqrt(sigma2))()).sort((a, b) => a - b);
const round = val => Math.round(Number(val) * 1000) / 1000;

const App = () => {
  const classes = useStyles();
  const [openSettings, setOpenSettings] = useState(false);
  const [state, dispatch] = useReducer(vizReducer, initialState);

  useEffect(
    () =>
      dispatch({
        name: "sample",
        value: drawSample(10, state.muTheta, state.sigma2Theta)
      }),
    []
  );
  // debug
  //console.log("c("+state.sample.join(",")+")")
  const toggleDrawer = (side, open) => event => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    side == "right" ? setOpenSettings(open) : setOpen(open);
  };

  return (
    <div className={classes.root}>
      <SEO
        keywords={[
          `Maximum likelihood`,
          `Likelihood`,
          `Likelihood ratio test`,
          `Score test`,
          `Wald`,
          `Statistics`,
          `Interactive`,
          `Visualization`,
          `Teaching`,
          `Science`,
          `Psychology`
        ]}
      />
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <VizDispatch.Provider value={dispatch}>
          <HeaderAppBar />
          <SettingsDrawer
            handleDrawer={toggleDrawer}
            open={openSettings}
            vizState={state}
          >
            <Container>
              <Typography
                variant="h2"
                component="h1"
                className={classes.siteTitle}
                gutterBottom
                align="center"
              >
                Understanding Maximum Likelihood
              </Typography>
              <Typography
                variant="h4"
                component="h2"
                align="center"
                className={classes.siteSubTitle}
                gutterBottom
              >
                An Interactive Visualization
              </Typography>
              <Typography align="center">
                Created by{" "}
                <a href="https://rpsychologist.com/">Kristoffer Magnusson</a>
                <br />
                <a href="https://twitter.com/krstoffr">
                  <Button className={classes.twitter}>
                    <TwitterIcon />
                    krstoffr
                  </Button>
                </a>
              </Typography>
            </Container>
            <Container className={classes.textContent}>
              <IntroText />
            </Container>
            <Content
              openSettings={openSettings}
              vizState={state}
              toggleDrawer={toggleDrawer}
            />
            <Container className={classes.textContent}>
              <Typography
                variant="h4"
                component="h2"
                align="center"
                gutterBottom
                style={{paddingTop: "1em"}}
              >
                FAQ
              </Typography>
              <Faq />
              <Contribute />
              <Posters />
            </Container>
            <Container maxWidth="lg">
              <MoreViz />
            </Container>
          </SettingsDrawer>
        </VizDispatch.Provider>
        <Footer />
      </ThemeProvider>
    </div>
  );
};
export default App;