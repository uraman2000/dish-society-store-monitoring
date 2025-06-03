export function mapTaskNameToStandard(taskName) {
  // Direct matches from checklist
  if (taskName === "DISH SOCIETY - FOH OPENING" ||
      taskName === "DISH SOCIETY - TRANSITION" ||
      taskName === "DISH SOCIETY - FOH CLOSING" ||
      taskName === "Line Check") {
    return taskName;
  }

  // Map deep clean variations - using more specific matching
  if (taskName.includes("Monday FOH Deep Clean") || 
      taskName.includes("FOH Deep Clean")) {
    return "DISH - FOH Deep Clean";
  }

  if (taskName.includes("Monday BOH Deep Clean") || 
      taskName.includes("BOH Deep Clean")) {
    return "DISH - BOH Deep Clean";
  }

  // Return original if no mapping found
  return taskName;
} 