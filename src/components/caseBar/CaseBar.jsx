import "./CaseBar.scss";

export default function CaseBar(props) {
  const getDateStr = (input) => {
    const date = new Date(Date.parse(input));
    const month = (date.getMonth() + 1);
    const monthStr = month < 10 ? "0" + month : month;
    const dateStr = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return date.getFullYear() + "-" + monthStr + "-" + dateStr;
  }

  return <div onClick={props.onClick} className="casebar">
    <p className="hiddable">{props.data.firstname + " " + props.data.lastname}</p>
    <p>{props.data.side_of_analysis}</p>
    <p>{props.data.date_of_surgery}</p>
    <p className="hiddable">{props.data.report_id}</p>
    {/* <p>{props.data.report_id}</p> */}
    <p>{props.data.case_status}</p>
    <p>{getDateStr(props.data.created)}</p>
  </div>
}