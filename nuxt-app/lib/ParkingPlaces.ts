export type Tatbestand = {
  order: number,
  tbnr: string,
  title: string,
  mailText: string
}

export const TATBESTÄNDE = Object.fromEntries(
  [
    {
      order: 0,
      tbnr: "112050",
      title: "Gehweg",
      mailText: "Gehweg"
    },
    {
      order: 10,
      tbnr: "112474",
      title: "Radweg",
      mailText: "Radweg"
    },
    {
      order: 11,
      tbnr: "141174",
      title: "bnpf. Radweg",
      mailText: "benutzungspflichtiger Radweg"
    },
    {
      order: 12,
      tbnr: "142170",
      title: "Schutzstreifen",
      mailText: "Schutzstreifen, Zeichen 340"
    },
    {
      order: 50,
      tbnr: "141302",
      title: "Fußgängerüberweg",
      mailText: "weniger als 5 Meter vor einem Fußgängerüberweg"
    },
    {
      order: 40,
      tbnr: "112262",
      title: "Kreuzung",
      mailText: "weniger als 5 Meter Abstand zur Kreuzung"
    },
    {
      order: 35,
      tbnr: "112262",
      title: "Sperrfläche",
      mailText: "Sperrfläche, Zeichen 298"
    },
    {
      order: 60,
      tbnr: "112262",
      title: "2. Reihe",
      mailText: "in der Zweiten Reihe"
    },
    {
      order: 30,
      tbnr: "112372",
      title: "Bordsteinabsenkung",
      mailText: "vor einer Bordsteinabsenkung"
    },
    {
      order: 20,
      tbnr: "141332",
      title: "Fahrbahnbegrenzung",
      mailText: "links von einer Fahrbahnbegrenzung (Zeichen 295)"
    },
    {
      order: 55,
      tbnr: "142278",
      title: "Behindertenparkplatz",
      mailText: "gekennzeichneter Behindertenparkplatz"
    },
    {
      order: 70,
      tbnr: "901400",
      title: "Grünfläche",
      mailText: "Grünfläche"
    }
  ].map(tatbestand => [tatbestand.tbnr, tatbestand])
);
