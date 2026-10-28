import { describe, expect, it } from "vitest";

import { assess, highlightedAxes, jumpToScore, ratingToScore, recommendationPlan, type AssessmentInput } from "./index";

const base: AssessmentInput = {
  age: 24,
  heightCm: 186,
  weightKg: 78,
  verticalJumpCm: 76,
  position: "receptor",
  skills: { saque: 4, recepcion: 2, colocacion: 3, remate: 5, bloqueo: 4, defensa: 2 },
  goal: "debil",
  weeklyDays: 3,
};

describe("ratingToScore", () => {
  it("convierte la nota 1–5 en 0–100", () => {
    expect([1, 2, 3, 4, 5].map((n) => ratingToScore(n as 1))).toEqual([0, 25, 50, 75, 100]);
  });
});

describe("jumpToScore", () => {
  it("limita la puntuación entre 0 y 100", () => {
    expect(jumpToScore(10, 24, "nose")).toBe(0);
    expect(jumpToScore(110, 24, "nose")).toBe(100);
  });

  it("puntúa más el mismo salto en un líbero que en un central", () => {
    expect(jumpToScore(55, 24, "libero")).toBeGreaterThan(jumpToScore(55, 24, "central"));
  });

  it("puntúa más el mismo salto con 14 años que con 24", () => {
    expect(jumpToScore(45, 14, "receptor")).toBeGreaterThan(jumpToScore(45, 24, "receptor"));
  });
});

describe("assess", () => {
  it("reproduce el perfil de ejemplo: Rematador explosivo", () => {
    const result = assess(base);
    expect(result.scores).toMatchObject({
      remate: 100,
      bloqueo: 75,
      saque: 75,
      defensa: 25,
      recepcion: 25,
      colocacion: 50,
    });
    expect(result.mainWeapon).toBe("remate");
    expect(result.archetype).toBe("rematador-explosivo");
    expect(result.toReinforce.slice(0, 2)).toEqual(["recepcion", "defensa"]);
  });

  it("las fortalezas y las áreas a reforzar no se solapan", () => {
    const result = assess(base);
    expect(result.strengths).toHaveLength(2);
    expect(result.strengths.some((axis) => result.toReinforce.includes(axis))).toBe(false);
    expect(result.toReinforce.length).toBeGreaterThanOrEqual(2);
    expect(result.toReinforce.length).toBeLessThanOrEqual(3);
  });

  it("pondera por posición: un líbero con recepción baja la prioriza sobre el saque", () => {
    const result = assess({
      ...base,
      position: "libero",
      skills: { saque: 1, recepcion: 2, colocacion: 4, remate: 1, bloqueo: 1, defensa: 5 },
    });
    expect(result.toReinforce[0]).toBe("recepcion");
    expect(result.mainWeapon).toBe("defensa");
  });

  it("con salto desconocido usa un valor neutro y no lo cuenta como fortaleza ni debilidad", () => {
    const result = assess({ ...base, verticalJumpCm: null });
    expect(result.jumpEstimated).toBe(true);
    expect(result.scores.salto).toBe(50);
    expect([...result.strengths, ...result.toReinforce]).not.toContain("salto");
  });

  it("detecta un perfil equilibrado", () => {
    const result = assess({
      ...base,
      verticalJumpCm: 55,
      skills: { saque: 3, recepcion: 3, colocacion: 3, remate: 3, bloqueo: 3, defensa: 3 },
    });
    expect(result.archetype).toBe("todoterreno");
  });

  it("detecta a quien está empezando sin juzgarle", () => {
    const result = assess({
      ...base,
      verticalJumpCm: 25,
      skills: { saque: 1, recepcion: 2, colocacion: 1, remate: 2, bloqueo: 1, defensa: 1 },
    });
    expect(result.archetype).toBe("diamante-en-bruto");
  });

  it("es determinista ante empates", () => {
    const flat = {
      ...base,
      skills: { saque: 3, recepcion: 3, colocacion: 3, remate: 3, bloqueo: 3, defensa: 3 },
    } as const;
    expect(assess(flat)).toEqual(assess(flat));
  });

  it("la altura no cambia ninguna puntuación, solo el peso del salto", () => {
    const tall = assess({ ...base, position: "central", heightCm: 200 });
    const short = assess({ ...base, position: "central", heightCm: 175 });
    expect(tall.scores).toEqual(short.scores);
  });
});

describe("rumbo", () => {
  it("cambiar de 'reforzar lo débil' a 'potenciar lo fuerte' cambia el foco", () => {
    const result = assess(base);
    const debil = recommendationPlan(result, "debil");
    const fuerte = recommendationPlan(result, "fuerte");
    expect(debil.focus).toEqual(result.toReinforce);
    expect(fuerte.focus).toEqual(["remate"]);
    expect(debil.focus).not.toEqual(fuerte.focus);
  });

  it("equilibrado mezcla el área principal a reforzar con el arma principal", () => {
    const result = assess(base);
    expect(highlightedAxes(result, "equilibrado")).toEqual(["remate", "recepcion"]);
  });
});
