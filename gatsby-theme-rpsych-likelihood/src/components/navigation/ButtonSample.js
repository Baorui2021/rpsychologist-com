import React, { useContext } from "react";
import Button from '@material-ui/core/Button';
import { VizDispatch } from "../../App";
import { drawSample } from "../../App";

export default function SampleButton({M, sigma2}) {
  const dispatch = useContext(VizDispatch);

  const onClick = () => {
    const newSample = drawSample(10, M, sigma2)
    dispatch({ name: "sample", value: newSample });
  }

  return (
    <div>
      <div>
        <Button
          variant="contained"
          onClick={onClick}>
          New Sample
        </Button>
      </div>
    </div>
  );
}
