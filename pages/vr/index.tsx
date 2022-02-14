import { Assets, Entity, Mixin, Plane, Scene, Sky, Text } from '@belivvr/aframe-react';
import { NextPage } from 'next';
import Script from 'next/script';
import React, { useEffect, useState } from 'react';
import Piano from '../../components/AFrame/Piano';
import useMIDI from '../../hooks/useMIDI';

const VRPage: NextPage = () => {
  const [rendered, setRendered] = useState<boolean>(false);
  const { onOK } = useMIDI();

  useEffect(() => {
    setRendered(true);

    if (typeof window !== 'undefined') {
      require('aframe'); // eslint-disable-line global-require
      require('aframe-geometry-merger-component');
      require('aframe-slice9-component');

      if (!AFRAME.components['button-test']) {
        AFRAME.registerComponent('button-test', {
          schema: {},
          init: function () {
            // const onClickTest = (e) => {
            //   console.log({ e });
            //   console.log('test');
            // };

            this.el.addEventListener('click', onOK);

            // this.el.addEventListener('mouseenter', () => {
            //   this.el.setAttribute('color', '#F59E0B');
            //   this.el.children[0].setAttribute('color', '#F59E0B');
            //   console.log('마우스 오버됨');
            // });

            // this.el.addEventListener('mouseleave', () => {
            //   this.el.setAttribute('color', '#ffffff');
            //   this.el.children[0].setAttribute('color', '#ffffff');
            //   console.log('마우스 떠남');
            // });
          },
        });
      }

      /**
       * A button with text
       * @namespace ui
       * @component text-button
       */
      if (!AFRAME.components['text-button']) {
        AFRAME.registerComponent('text-button', {
          schema: {
            textHoverColor: { type: 'string' },
            textColor: { type: 'string' },
            backgroundHoverColor: { type: 'string' },
            backgroundColor: { type: 'string' },
          },

          init() {
            // TODO: This is a bit of a hack to deal with position "component" not setting matrixNeedsUpdate. Come up with a better solution.
            // this.el.object3D.matrixNeedsUpdate = true;
            this.el.object3D.matrixWorldNeedsUpdate = true;
            this.onHover = () => {
              this.hovering = true;
              this.updateButtonState();
            };
            this.onHoverOut = () => {
              this.hovering = false;
              this.updateButtonState();
            };
            this.textEl = this.el.querySelector('[text]');
          },

          play() {
            this.updateButtonState();
            this.el.object3D.addEventListener('hovered', this.onHover);
            this.el.object3D.addEventListener('unhovered', this.onHoverOut);
          },

          pause() {
            this.el.object3D.removeEventListener('hovered', this.onHover);
            this.el.object3D.removeEventListener('unhovered', this.onHoverOut);
          },

          update() {
            this.updateButtonState();
          },

          updateButtonState() {
            const hovering = this.hovering;
            this.el.setAttribute(
              'slice9',
              'color',
              hovering ? this.data.backgroundHoverColor : this.data.backgroundColor,
            );

            if (this.textEl) {
              this.textEl.setAttribute('text', 'color', hovering ? this.data.textHoverColor : this.data.textColor);
            }
          },
        });
      }
      // const noop = function () {};
      // // TODO: this should ideally be fixed upstream somehow but its pretty tricky since text is just a geometry not a different type of Object3D, and Object3D is what handles raycast checks.
      // AFRAME.registerComponent('text-raycast-hack', {
      //   dependencies: ['text'],
      //   init() {
      //     this.el.getObject3D('text').raycast = noop;
      //   },
      // });s;
    }
  }, [setRendered, onOK]);

  if (!rendered) {
    return <>loading</>;
  }

  return (
    <Scene
      inspector={{
        url: new URL(
          'https://cdn.jsdelivr.net/gh/aframevr/aframe-inspector@master/dist/aframe-inspector.min.js',
          // "https://aframe.io/aframe-inspector/dist/aframe-inspector.min.js",
        ),
      }}
      cursor="rayOrigin: mouse; fuse: false"
      raycaster="objects: .raycastable"
      background={{
        transparent: true,
      }}
    >
      {/* <Entity environment="preset: threetowers; active: true;" visible /> */}
      {/* <a-entity visible="true" environment="preset: threetowers; active: true;">
        <a-entity class="environment" position="" light="" visible=""></a-entity>
        <a-entity class="environment" position="" light="" visible=""></a-entity>
        <a-entity rotation="" class="environmentGround environment" visible="" scale="" shadow=""></a-entity>
        <a-entity class="environmentDressing environment" visible=""></a-entity>
        <a-sky radius="200" theta-length="110" class="environment" material="" visible="" geometry="" scale=""></a-sky>
      </a-entity> */}
      <Assets>
        <img id="button" src="/assets/hud/button.9.png" alt="button" />
      </Assets>
      {/* <Camera
        lookControls={{
          enabled: true,
        }}
      > */}
      {/* <Cursor
        cursor={{
          rayOrigin: 'mouse',
          mouseCursorStylesEnabled: true,
          fuse: false,
          fuseTimeout: 500,
        }}
        raycaster={{
          objects: '.raycastable',
        }}
      /> */}
      {/* </Camera> */}
      <Piano
        position={{
          x: 0,
          y: 0.75,
          z: -0.4,
        }}
      />
      {/* <Mixin
        id="frame"
        geometry={{
          primitive: 'plane',
          width: 1,
          height: 1,
        }}
        material={{
          color: '#ffffff',
          shader: 'flat',
        }}
      /> */}
      <Script src="https://rawgit.com/rdub80/aframe-gui/master/dist/aframe-gui.min.js" strategy="lazyOnload" />
      <Script
        src="https://unpkg.com/aframe-environment-component@1.3.1/dist/aframe-environment-component.min.js"
        strategy="lazyOnload"
      />
      {/* <a-gui-button
        width="2.5"
        height="0.7"
        base-depth="0.025"
        depth="0.1"
        gap="0.1"
        onclick={onClickTest}
        key-code="32"
        value="Sample Button"
        font-family="assets/fonts/PermanentMarker-Regular.ttf"
        font-size="0.25"
        margin="0 0 0.05 0"
        font-color="black"
        active-color="red"
        hover-color="yellow"
        border-color="white"
        focus-color="black"
        background-color="orange"
        bevel="true"
        position="0 0.5 -0.5"
      /> */}
      {/* <a-gui-radio
        width="2"
        height="0.5"
        onclick={onClickTest}
        value="label radio"
        margin="0 0 0.05 0"
        font-color="#006064"
        border-color="#006064"
        background-color="#E0F7FA"
        hover-color="#00838F"
        active-color="#FFEB3B"
        handle-color="#00838F"
      ></a-gui-radio> */}
      <Text value="뮤야효" position={{ x: 0, y: 1.5, z: -4 }} />
      <Entity
        position={{
          x: 0,
          y: 0,
          z: 0.1,
        }}
        mixin="rounded-text-button"
      >
        <Text
          position={{
            x: 0,
            y: 0,
            z: 0.02,
          }}
          align="center"
          value="unmute"
          width={2}
        />
      </Entity>
      <Plane position={{ x: 0, y: 0, z: 0 }} rotation={{ x: -90, y: 0, z: 0 }} width={1} height={1} color="#7BC8A4" />
      {/* <a-text
        value="Hello, 안녕!"
        color="#FFFFFF"
        shader="msdf"
        font="https://raw.githubusercontent.com/myso-kr/aframe-fonts-korean/master/fonts/ofl/nanumgothic/NanumGothic-Regular.json"
        position="6.7 1 -2"
      ></a-text> */}
      <Plane width={1} height={1} color="#FF3F02" position={{ x: 0, y: 2, z: -1 }} button-test className="raycastable">
        <Text
          value="테스트 버튼"
          color="#000000"
          shader="msdf"
          font="https://raw.githubusercontent.com/myso-kr/aframe-fonts-korean/master/fonts/ofl/nanumgothic/NanumGothic-Regular.json"
          width={1}
          height={1}
          position={{
            x: 0,
            y: 0,
            z: 0,
          }}
          // scale={{
          //   x: 0.2,
          //   y: 0.2,
          //   z: 0.2,
          // }}
        />
      </Plane>
      {/* <Box
        position={{ x: 0, y: 0.5, z: -1 }}
        width={0.5}
        height={0.5}
        depth={0.5}
        color="#4CC3D9"
        animation__scale={{
          property: 'scale',
          to: '1.2 1.2 1.2',
          dur: 200,
          startEvents: ['mouseenter'],
        }}
        animation__scale__reverse={{
          property: 'scale',
          to: '1 1 1',
          dur: 200,
          startEvents: ['mouseleave'],
        }}
        className="raycastable"
        // clickable
      /> */}
      <Text value="Hello World" position={{ x: 0, y: 1.5, z: -4 }} />
      <Sky color="#ECECEC" />
      <Entity
        handTrackingControls={{
          hand: 'left',
          modelColor: '#fbceb1',
        }}
        laserControls={{
          hand: 'left',
        }}
        oculusTouchControls={{
          hand: 'left',
        }}
        raycaster={{
          far: 100,
          objects: '.raycastable',
        }}
      />
      <Entity
        handTrackingControls={{
          hand: 'right',
          modelColor: '#fbceb1',
        }}
        laserControls={{
          hand: 'right',
        }}
        oculusTouchControls={{
          hand: 'right',
        }}
        raycaster={{
          far: 100,
          objects: '.raycastable',
        }}
      />
      <Mixin
        id="rounded-text-button"
        slice9="
          width: 0.45;
          height: 0.2;
          left: 64;
          top: 64;
          right: 66;
          bottom: 66;
          transparent: false;
          alphaTest: 0.1;
          src: #button;
        "
      />
    </Scene>
  );
};

export default VRPage;
