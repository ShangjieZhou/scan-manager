import "./Gallery.scss";
import AnnotationCard from "../annotationCard/AnnotationCard";
import { ANNOTATION } from "../../assets/stepsData";
import { useEffect, useState } from "react";
import { make_request, fetchImage } from "../../helpers";
import { useParams, useNavigate } from "react-router-dom";

export default function Gallery(props) {
  const [apImage, setApImage] = useState(null);
  const [apLandmarks, setApLandmarks] = useState(null);
  const [lstImage, setLstImage] = useState(null);
  const [lstLandmarks, setLstLandmarks] = useState(null);
  const [lseImage, setLseImage] = useState(null);
  const [lseLandmarks, setLseLandmarks] = useState(null);
  const { caseId } = useParams();
  const navigator = useNavigate();

  useEffect(() => {
    init();
  }, [])

  const init = async () => {
    const data = await make_request('/api/case/' + caseId, 'GET');
    const landmarks = data.landmarkselections;

    // get the 3 images
    const ap = await fetchImage(data.imagingdata.xray_ap);
    const lst = await fetchImage(data.imagingdata.xray_lst);
    const lse = await fetchImage(data.imagingdata.xray_lse);

    setApImage(ap);
    setApLandmarks([
      { type: ANNOTATION.DOUBLE_LINES, data: landmarks.cortical_coords }
    ]);

    setLstImage(lst);
    setLstLandmarks([
      { type: ANNOTATION.SINGLE_LINE, data: landmarks.st_s1_coords },
      { type: ANNOTATION.SINGLE_LINE, data: landmarks.st_l1_coords },
      { type: ANNOTATION.SINGLE_LINE, data: landmarks.st_asis_coords },
      { type: ANNOTATION.DOT, data: landmarks.st_ps_coord },
      { type: ANNOTATION.DOUBLE_CIRCLES, data: [landmarks.st_h1_coord, landmarks.st_h1_radius, landmarks.st_h2_coord, landmarks.st_h2_radius] }
    ]);

    setLseImage(lse);
    setLseLandmarks([
      { type: ANNOTATION.SINGLE_LINE, data: landmarks.se_s1_coords },
      { type: ANNOTATION.SINGLE_LINE, data: landmarks.se_l1_coords },
    ]);
  }

  return <div id="gallery-section">
    <AnnotationCard
      title="Standing AP"
      src={apImage}
      landmarks={apLandmarks}
      onClick={() => navigator('/annotation-steps/' + caseId + '?startingStep=0')}
    />
    <AnnotationCard
      title="Standing Lateral"
      src={lstImage}
      landmarks={lstLandmarks}
      onClick={() => navigator('/annotation-steps/' + caseId + '?startingStep=1')}
    />
    <AnnotationCard
      title="Relax Seated Lateral"
      src={lseImage}
      landmarks={lseLandmarks}
      onClick={() => navigator('/annotation-steps/' + caseId + '?startingStep=6')}
    />
  </div>
}