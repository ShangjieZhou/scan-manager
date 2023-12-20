import { useState } from 'react';
import { Popover, Button } from '@mui/material';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { GoTriangleDown } from 'react-icons/go';
import "./IndicatorBar.scss";
import { bounds, portions, colors } from '../../assets/colorBarConfig';


// const ColorBar = styled.div`
//     position: relative;
//     height: 100%;
//     overflow: hidden;
//     width: 50%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     cursor: grab;
//     cursor: -webkit-grab;

//     ${props => props.width && css`
//         width: ${props.width}
//     `}
// `

export default function IndicatorBar(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getPositionedStyle = () => {
    // get position on scale
    const offset = props.number - bounds[props.barType][0];
    const span = bounds[props.barType][1] - bounds[props.barType][0]
    const percentage = Math.min(1, Math.max(0, offset / span));

    // get arrow color
    const totalUnits = portions[props.barType][0] + portions[props.barType][1] + portions[props.barType][2];
    const redUpper = portions[props.barType][0] / totalUnits;
    const yellowUpper = (portions[props.barType][0] + portions[props.barType][1]) / totalUnits;
    const color = percentage <= redUpper ? colors.red : percentage <= yellowUpper ? colors.yellow : colors.green;
    return {
      width: '10px',
      position: 'relative',
      left: `calc(${percentage * 100}% - 5px)`,
      color: color
    }
  }

  return <div className='bar-container'>
    <Popover
      open={anchorEl !== null}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <p>Hello blablabla</p>
    </Popover>
    <div className="indicator-text">
      <h2>{props.title}</h2>
      <h2 className='index'>{props.number}{props.unit}</h2>

      <AiOutlineQuestionCircle onClick={handleClick} />
    </div>
    <div className='indicator-index'>
      <GoTriangleDown style={getPositionedStyle()} />
      <div style={{ gridTemplateColumns: `${portions[props.barType][0]}fr ${portions[props.barType][1]}fr ${portions[props.barType][2]}fr` }} className='colorbar'>
        <div style={{ backgroundColor: colors.red }} className='color'></div>
        <div style={{ backgroundColor: colors.yellow }} className='color'></div>
        <div style={{ backgroundColor: colors.green }} className='color'></div>
      </div>
    </div>
  </div >
}