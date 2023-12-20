import IndicatorBar from "../indicatorBar/IndicatorBar";
import "./Indicator.scss";
import { BARTYPE } from "../../assets/colorBarConfig";
import { useState } from "react";
import { useEffect } from "react";
import { make_request } from "../../helpers";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

export default function Indicators(props) {
  const [boneQuality, setBoneQuality] = useState(0);
  const [deformity, setDeformity] = useState(0);
  const [mobility, setMobility] = useState(0);
  const { caseId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, [])

  const init = async () => {
    const res = await make_request(`/api/case/${caseId}`, 'GET');
    setBoneQuality(res.planningparameters.ci);
    setDeformity(res.planningparameters.spinal_deformity);
    setMobility(res.planningparameters.spinal_mobility);
    setLoading(false);
  }

  return <div id="indicator-section">
    {loading
      ? <CircularProgress />
      : <>
        <IndicatorBar barType={BARTYPE.BONE_QUALITY} title="Bone Quality" number={boneQuality} unit="%" />
        <IndicatorBar barType={BARTYPE.SPINAL_DEFORMITY} title="Spinal Deformity" number={deformity} unit="°" />
        <IndicatorBar barType={BARTYPE.SPINAL_MOBILITY} title="Spinal Mobility" number={mobility} unit="°" />
      </>
    }
  </div>
}
