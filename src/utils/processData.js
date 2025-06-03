import { mapTaskNameToStandard } from './taskNameMapper';

export function processTaskData(data) {
  return data.map(item => ({
    ...item,
    name: mapTaskNameToStandard(item.name)
  }));
} 