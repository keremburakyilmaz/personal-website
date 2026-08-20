import { Link, useParams } from 'react-router-dom';
import NotFound from '../components/NotFound/NotFound';
import FoundObject from './FoundObject';
import Somewhere from './Somewhere';
import WordCorridor from './WordCorridor';
import MinorOmen from './MinorOmen';
import MuseumDetail from './MuseumDetail';
import InternetWeather from './InternetWeather';
import { experimentNeighbors, experimentPath } from './experiments';
import './Lab.css';

const INSTRUMENTS = {
  'found-object': FoundObject,
  somewhere: Somewhere,
  'word-corridor': WordCorridor,
  'minor-omen': MinorOmen,
  'museum-detail': MuseumDetail,
  'internet-weather': InternetWeather,
};

function ExperimentPager({ previous, next }) {
  return (
    <nav className="lab-experiment-pager" aria-label="Experiment navigation">
      <Link to={experimentPath(previous)}>
        <span>← PREVIOUS</span>
        <strong>{previous.number} / {previous.title}</strong>
      </Link>
      <Link className="lab-experiment-pager__index" to="/lab">LAB INDEX</Link>
      <Link to={experimentPath(next)}>
        <span>NEXT →</span>
        <strong>{next.number} / {next.title}</strong>
      </Link>
    </nav>
  );
}

export default function LabExperimentRoute() {
  const { experimentSlug } = useParams();
  const context = experimentNeighbors(experimentSlug);
  if (!context) return <NotFound />;

  const Instrument = INSTRUMENTS[experimentSlug];
  if (!Instrument) return <NotFound />;

  return (
    <div className="lab-page lab-experiment-page">
      <div className="lab-experiment-page__topline">
        <Link to="/lab">← LAB / INDEX</Link>
        <span>{context.experiment.type} / {context.experiment.status}</span>
      </div>
      <Instrument />
      <ExperimentPager previous={context.previous} next={context.next} />
    </div>
  );
}
