import PropTypes from 'prop-types';

// Common PropTypes for the railway system
export const TrainPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['EXPRESS', 'LOCAL', 'FREIGHT', 'MAINTENANCE']).isRequired,
  currentSection: PropTypes.string.isRequired,
  currentPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
  }).isRequired,
  speed: PropTypes.number.isRequired,
  delay: PropTypes.number.isRequired,
  status: PropTypes.oneOf(['RUNNING', 'STOPPED', 'DELAYED', 'MAINTENANCE']).isRequired,
  destination: PropTypes.string.isRequired,
  passengerCount: PropTypes.number,
  cargoTons: PropTypes.number,
  priority: PropTypes.number.isRequired,
  route: PropTypes.arrayOf(PropTypes.string).isRequired
});

export const SectionPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  capacity: PropTypes.number.isRequired,
  currentLoad: PropTypes.number.isRequired,
  maxSpeed: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  status: PropTypes.oneOf(['NORMAL', 'CONGESTED', 'BLOCKED', 'MAINTENANCE']).isRequired
});

export const AIRecommendationPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['PRIORITY', 'ROUTING', 'SCHEDULING', 'EMERGENCY', 'OPTIMIZATION']).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  impact: PropTypes.string.isRequired,
  confidence: PropTypes.number.isRequired,
  urgency: PropTypes.oneOf(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).isRequired,
  executed: PropTypes.bool.isRequired
});

export const PerformanceMetricsPropType = PropTypes.shape({
  throughput: PropTypes.number.isRequired,
  averageDelay: PropTypes.number.isRequired,
  efficiency: PropTypes.number.isRequired,
  conflicts: PropTypes.number.isRequired,
  totalTrains: PropTypes.number.isRequired,
  activeTrains: PropTypes.number.isRequired,
  sectionsUtilized: PropTypes.number.isRequired
});

// Common component prop types
export const ComponentPropTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  onLoad: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};
