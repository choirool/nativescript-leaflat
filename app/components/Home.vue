<template>
  <Page>
    <ActionBar>
      <Label text="Home" />
    </ActionBar>

    <GridLayout columns="*" rows="*">
      <AWebView
        col="0"
        row="0"
        @loaded="loadStarted"
        @loadFinished="loadFinished"
      ></AWebView>
      <!-- <Label class="info">
        <FormattedString>
          <Span class="fas" text.decode="&#xf135; " />
          <Span :text="message" />
        </FormattedString>
      </Label> -->
    </GridLayout>
  </Page>
</template>

<script>
import { AWebView } from "@nativescript-community/ui-webview";
import * as geolocation from "@nativescript/geolocation";

export default {
  methods: {
    loadFinished(args) {
      console.log("load finihsed");
    },
    loadStarted(args) {
      const view = args.object;
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
