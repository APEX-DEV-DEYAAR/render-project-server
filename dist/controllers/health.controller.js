export function createHealthController() {
    return {
        check(_req, res) {
            res.json({ ok: true, service: "feasibility-api" });
        },
    };
}
//# sourceMappingURL=health.controller.js.map