<script lang="ts" setup>

const reports = useUserReports();

const reportsByPlate = computed(() => 
  Object.values(reports.value).reduce((prev: any, curr : any) => {
      if (!curr.plate) return prev

      if (prev[curr.plate]) {
        prev[curr.plate].push(curr)
      } else {
        prev[curr.plate] = [curr]
      }

      return prev
    }, {} as {[key: string]: any[]})
)

const plateAmounts = computed(() => Object.entries(reportsByPlate.value).map(([plate, values]) => ({ plate, amount: values.length })))
const mostReportedPlates = computed(() => plateAmounts.value.filter(({amount}) => amount > 1).sort((a, b) => b.amount - a.amount))

</script>

<template>
  <div>
    Page: {{mostReportedPlates[0]}} {{mostReportedPlates[1]}} {{mostReportedPlates[2]}}
  </div>
</template>

<style scoped></style>
