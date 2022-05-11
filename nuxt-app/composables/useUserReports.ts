import { refDefault } from "@vueuse/core";
import { child } from "firebase/database";
import { Ref } from "nuxt/dist/app/compat/capi";
import { ImageData } from '~/lib/ImageData';

export const useUserReports = (): Ref<{[key: string]: ImageData}> => {
  const userRef = useUserRef();
  const imageRef = computed(() => userRef.value != null ? child(userRef.value, 'images') : null)
  return refDefault(useRTDB(imageRef), {})
}
