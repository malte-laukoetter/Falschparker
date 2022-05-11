// MIT License
//
// Copyright (c) 2019-PRESENT Anthony Fu<https://github.com/antfu>
// Copyright (c) 2022 Malte Laukötter
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { DatabaseReference, DataSnapshot, onValue, off } from "firebase/database"
import { Ref } from "nuxt/dist/app/compat/capi"
import { tryOnScopeDispose } from '@vueuse/core'

export interface RTDBOptions {
  autoDispose?: boolean
}

export function useRTDB<T = any>(
  docRef: Ref<DatabaseReference> | DatabaseReference,
  options: RTDBOptions = {},
) {
  const {
    autoDispose = true,
  } = options

  const data = ref(undefined) as Ref<T | undefined>

  console.log(docRef)
  console.log(unref(docRef))

  function update(snapshot: DataSnapshot) {
    console.log(snapshot)
    data.value = snapshot.val()
  }

  watch(() => unref(docRef), (dref, oldRef) => {
    console.log(dref, oldRef)
    if (oldRef != null && unref(oldRef) != null) {
      tryOnScopeDispose(() => {
        off(unref(oldRef), 'value', update)
      });
    }

    data.value = undefined;

    if (unref(dref) != null) {
      onValue(unref(dref), update);
    }
  }, { immediate: true })

  if (autoDispose) {
    tryOnScopeDispose(() => {
      off(unref(docRef), 'value', update)
    })
  }

  return data
}