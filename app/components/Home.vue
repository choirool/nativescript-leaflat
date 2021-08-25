<template>
  <Page>
    <ActionBar>
      <Label text="Airports" />
    </ActionBar>

    <GridLayout columns="*" rows="50,*">
      <RadAutoCompleteTextView
        ref="autocomplete"
        displayMode="plain"
        suggestMode="Suggest"
        :items="dataItems"
        @didAutoComplete="onDidAutoComplete"
      >
        <SuggestionView ~suggestionView suggestionViewHeight="300">
          <StackLayout
            v-suggestionItemTemplate
            orientation="vertical"
            padding="10"
          >
            <v-template>
              <Label :text="item.text"></Label>
            </v-template>
          </StackLayout>
        </SuggestionView>
      </RadAutoCompleteTextView>
      <AWebView col="0" row="1" @loaded="loadStarted"></AWebView>
    </GridLayout>
  </Page>
</template>

<script>
import { AWebView } from "@nativescript-community/ui-webview";
import * as geolocation from "@nativescript/geolocation";
import { TokenModel } from "nativescript-ui-autocomplete";
import { ObservableArray, Http } from "@nativescript/core";

// https://v6.docs.nativescript.org/vuejs/ns-ui/autocompletetextview/aync-data
export default {
  data() {
    return {
      dataItems: new ObservableArray(),
      airports: new Array(),
      webView: null,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      const jsonUrl =
        "https://raw.githubusercontent.com/NativeScript/nativescript-ui-samples/master/examples-data/airports.json";

      this.$refs.autocomplete.setLoadSuggestionsAsync((text) => {
        this.airports = new Array();
        const promise = new Promise((resolve, reject) => {
          Http.getJSON(jsonUrl)
            .then((r) => {
              const items = new Array();
              r.airports.forEach((airport) => {
                items.push(new TokenModel(airport.FIELD2, null));
                this.airports.push(airport);
              });

              resolve(items);
            })
            .catch((err) => {
              const message = `Error fetching remote data from ${jsonUrl}: ${err.message}`;
              console.log(message);
              reject();
            });
        });

        return promise;
      });
    },
    loadStarted(args) {
      const view = args.object;
      this.webView = view;
      if (view.android) {
        view.android.getSettings().setAllowFileAccess(true);
        view.android.getSettings().setAllowContentAccess(true);
        view.src = "~/www/index.html";
      }

      view.on(AWebView.shouldOverrideUrlLoadingEvent, (args) => {
        console.log(`${args.httpMethod} ${args.url}`);
        if (args.url.includes("google.com")) {
          args.cancel = true;
        }
      });

      view.on(AWebView.loadFinishedEvent, (args) => {
        geolocation
          .getCurrentLocation({
            desiredAccuracy: 3,
            maximumAge: 5000,
            timeout: 20000,
          })
          .then((data) => {
            view.emitToWebView("setCoordinate", {
              coordinates: {
                lat: data.latitude,
                lng: data.longitude,
              },
              zoom: 15,
            });
          });
      });

      view.on("zoomin", (data) => {
        console.log(data);
      });
    },
    onDidAutoComplete({ text }) {
      let airport = this.airports.find((airport) => airport.FIELD2 == text);
      this.updateCoordinate(airport);
    },
    updateCoordinate(data) {
      if (data) {
        this.webView.emitToWebView("updateCoordinate", {
          coordinates: {
            lat: data.FIELD7,
            lng: data.FIELD8,
          },
          zoom: 15,
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "@nativescript/theme/scss/variables/blue";

// Custom styles
.fas {
  @include colorize($color: accent);
}

.info {
  font-size: 20;
  horizontal-align: center;
  vertical-align: center;
}
</style>
