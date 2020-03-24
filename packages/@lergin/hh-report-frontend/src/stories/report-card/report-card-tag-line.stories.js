import ReportCardTagLine from "@/components/report-card/ReportCardTagLine.vue";

export default {
  component: ReportCardTagLine,
  title: "Report Card Tag Line"
};

export const normal = () => ({
  components: { ReportCardTagLine },
  template: `<report-card-tag-line offence="Geh-/Radweg" parking endangering></report-card-tag-line>`
});

export const minimal = () => ({
  components: { ReportCardTagLine },
  template: `<report-card-tag-line offence="Geh-/Radweg"></report-card-tag-line>`
});

export const all = () => ({
  components: { ReportCardTagLine },
  template: `<report-card-tag-line offence="Geh-/Radweg" parking endangering with-intend></report-card-tag-line>`
});