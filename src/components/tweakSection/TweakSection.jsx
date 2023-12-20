import { HiOutlineRefresh } from 'react-icons/hi';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import "./TweakSection.scss";
import { useEffect } from 'react';
import { make_request } from '../../helpers';
import { CircularProgress } from "@mui/material";

export default function TweakSection(props) {
  const [displayInc, setDisplayInc] = useState(0);
  const [displayAnt, setDisplayAnt] = useState(0);
  const [inclination, setInclination] = useState(0);
  const [anteversion, setAnteversion] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const timer = useRef(null);
  const { caseId } = useParams();

  useEffect(() => {
    init();
  }, [])

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      console.log("Inclination:" + inclination + "; Anteversion:" + anteversion);
      updateParams();
    }, 500);
  }, [inclination, anteversion])

  const init = async () => {
    const data = await make_request('/api/case/' + caseId, 'GET');
    console.log(data);
    setDisplayAnt(data.displaying_ant);
    setDisplayInc(data.displaying_inc);
    setInclination(data.planningparameters.st_inc);
    setAnteversion(data.planningparameters.st_ant);
    setOffset(data.planningparameters.supine_offset);
    setLoading(false);
  }

  const updateParams = async () => {
    setLoading(true);
    const payload = {
      st_inc: inclination.toString(),
      st_ant: anteversion.toString(),
      supine_offset: '+' + offset,
    }
    const res = await make_request(`/api/case/${caseId}/adjust-target`, 'PUT', payload);
    console.log(res);
    setDisplayInc(res.displaying_inc);
    setDisplayAnt(res.displaying_ant);
    setTimeout(() => setLoading(false), 400);
  }

  return <div id='tweak-section'>
    {loading
      ? <CircularProgress sx={{ position: "absolute" }} />
      : <>
        <h2>Direct Anterior Approach</h2>
        <h3>Navbit Sprint <span>Supine</span></h3>
        <h1><span>{displayInc}</span> <span>{displayAnt}</span></h1>
        <h3>Functional Standing Target</h3>
        <div className='row'>
          <h5>Default <span>42°/22°</span></h5>
          <HiOutlineRefresh />
        </div>
        <div className='col'>
          <div className='tweak-bar'>
            <h4>Inclination</h4>
            <AiOutlineMinus onClick={() => setInclination(inclination - 1)} className='left' />
            <h4>{inclination}°</h4>
            <AiOutlinePlus onClick={() => setInclination(inclination + 1)} className='right' />
          </div>
          <div className='tweak-bar'>
            <h4>Anteversion</h4>
            <AiOutlineMinus onClick={() => setAnteversion(anteversion - 1)} className='left' />
            <h4>{anteversion}°</h4>
            <AiOutlinePlus onClick={() => setAnteversion(anteversion + 1)} className='right' />
          </div>
        </div>
        <div className='col'>
          <h3>Supine Pelvic Tilt Offset</h3>
          <div className='row'>
            <AiOutlineMinus />
            <h4>+{offset}°</h4>
            <AiOutlinePlus />
          </div>
        </div>
      </>
    }
  </div>
}