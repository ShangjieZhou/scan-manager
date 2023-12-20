import { useEffect, useState } from "react";
import Gallery from "../../components/gallery/Gallery";
import Indicators from "../../components/indicators/Indicators";
import InfoDisplay from "../../components/infoDisplay/InfoDisplay";
import TweakSection from "../../components/tweakSection/TweakSection";
import { useParams } from "react-router-dom";
import { fetchImage, make_request } from "../../helpers";
import PageWrapper from "../pageWrapper/PageWrapper";
import "./DashboardPage.scss";

export default function DashboardPage(props) {
  return <PageWrapper>
    <div id="dashboard-page">
      <TweakSection />
      <Gallery />
      <Indicators />
      <InfoDisplay />
    </div>
  </PageWrapper>

}