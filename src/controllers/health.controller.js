/**
 * Endpoint de salud para comprobar rápidamente que Express responde.
 * También será el objetivo del smoke test con Mocha.
 */
export function getHealth(req, res) {
  return res.status(200).json({
    status: "success",
    data: {
      service: "helpdesk-api",
      healthy: true,
    },
  });
}
