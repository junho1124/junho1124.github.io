#   
  Ø                GLSL.std.450                     main    Z  ¾               /Users/choijunho/development/flutter/packages/flutter/lib/src/material/shaders/ink_sparkle.frag  #   Ì     // OpModuleProcessed entry-point ink_sparkle_fragment_main
// OpModuleProcessed auto-map-bindings
// OpModuleProcessed auto-map-locations
// OpModuleProcessed client opengl100
// OpModuleProcessed target-env opengl
// OpModuleProcessed entry-point main
#line 1
#version 320 es

// Copyright 2014 The Flutter Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

precision highp float;

// TODO(antrob): Put these in a more logical order (e.g. separate consts vs varying, etc)

layout(location = 0) uniform vec4 u_color;
layout(location = 1) uniform float u_alpha;
layout(location = 2) uniform vec4 u_sparkle_color;
layout(location = 3) uniform float u_sparkle_alpha;
layout(location = 4) uniform float u_blur;
layout(location = 5) uniform vec2 u_center;
layout(location = 6) uniform float u_radius_scale;
layout(location = 7) uniform float u_max_radius;
layout(location = 8) uniform vec2 u_resolution_scale;
layout(location = 9) uniform vec2 u_noise_scale;
layout(location = 10) uniform float u_noise_phase;
layout(location = 11) uniform vec2 u_circle1;
layout(location = 12) uniform vec2 u_circle2;
layout(location = 13) uniform vec2 u_circle3;
layout(location = 14) uniform vec2 u_rotation1;
layout(location = 15) uniform vec2 u_rotation2;
layout(location = 16) uniform vec2 u_rotation3;

layout(location = 0) out vec4 fragColor;

const float PI = 3.1415926535897932384626;
const float PI_ROTATE_RIGHT = PI * 0.0078125;
const float PI_ROTATE_LEFT = PI * -0.0078125;
const float ONE_THIRD = 1./3.;
const vec2 TURBULENCE_SCALE = vec2(0.8);

float saturate(float x) {
  return clamp(x, 0.0, 1.0);
}

float triangle_noise(highp vec2 n) {
  n = fract(n * vec2(5.3987, 5.4421));
  n += dot(n.yx, n.xy + vec2(21.5351, 14.3137));
  float xy = n.x * n.y;
  return fract(xy * 95.4307) + fract(xy * 75.04961) - 1.0;
}

float threshold(float v, float l, float h) {
  return step(l, v) * (1.0 - step(h, v));
}

mat2 rotate2d(vec2 rad){
  return mat2(rad.x, -rad.y, rad.y, rad.x);
}

float soft_circle(vec2 uv, vec2 xy, float radius, float blur) {
  float blur_half = blur * 0.5;
  float d = distance(uv, xy);
  return 1.0 - smoothstep(1.0 - blur_half, 1.0 + blur_half, d / radius);
}

float soft_ring(vec2 uv, vec2 xy, float radius, float thickness, float blur) {
  float circle_outer = soft_circle(uv, xy, radius + thickness, blur);
  float circle_inner = soft_circle(uv, xy, max(radius - thickness, 0.0), blur);
  return saturate(circle_outer - circle_inner);
}

float circle_grid(vec2 resolution, vec2 p, vec2 xy, vec2 rotation, float cell_diameter) {
  p = rotate2d(rotation) * (xy - p) + xy;
  p = mod(p, cell_diameter) / resolution;
  float cell_uv = cell_diameter / resolution.y * 0.5;
  float r = 0.65 * cell_uv;
  return soft_circle(p, vec2(cell_uv), r, r * 50.0);
}

float sparkle(vec2 uv, float t) {
  float n = triangle_noise(uv);
  float s = threshold(n, 0.0, 0.05);
  s += threshold(n + sin(PI * (t + 0.35)), 0.1, 0.15);
  s += threshold(n + sin(PI * (t + 0.7)), 0.2, 0.25);
  s += threshold(n + sin(PI * (t + 1.05)), 0.3, 0.35);
  return saturate(s) * 0.55;
}

float turbulence(vec2 uv) {
  vec2 uv_scale = uv * TURBULENCE_SCALE;
  float g1 = circle_grid(TURBULENCE_SCALE, uv_scale, u_circle1, u_rotation1, 0.17);
  float g2 = circle_grid(TURBULENCE_SCALE, uv_scale, u_circle2, u_rotation2, 0.2);
  float g3 = circle_grid(TURBULENCE_SCALE, uv_scale, u_circle3, u_rotation3, 0.275);
  float v = (g1 * g1 + g2 - g3) * 0.5;
  return saturate(0.45 + 0.8 * v);
}

void main() {
  vec2 p = gl_FragCoord.xy;
  vec2 uv = p * u_resolution_scale;
  vec2 density_uv = uv - mod(p, u_noise_scale);
  float radius = u_max_radius * u_radius_scale;
  float turbulence = turbulence(uv);
  float ring = soft_ring(p, u_center, radius, 0.05 * u_max_radius, u_blur);
  float sparkle = sparkle(density_uv, u_noise_phase) * ring * turbulence * u_sparkle_alpha;
  float wave_alpha = soft_circle(p, u_center, radius, u_blur) * u_alpha * u_color.a;
  vec4 wave_color = vec4(u_color.rgb * wave_alpha, wave_alpha);
  vec4 sparkle_color = vec4(u_sparkle_color.rgb * u_sparkle_color.a, u_sparkle_color.a);
  fragColor = mix(wave_color, sparkle_color, sparkle);
}
   
 GL_GOOGLE_cpp_style_line_directive    GL_GOOGLE_include_directive      main      !  u_circle1     "  u_rotation1   .  u_circle2     /  u_rotation2   :  u_circle3     ;  u_rotation3   Z  gl_FragCoord      _  u_resolution_scale    e  u_noise_scale     k  u_max_radius      m  u_radius_scale    u  u_center      x  u_blur      u_noise_phase       u_sparkle_alpha     u_alpha     u_color   ±  u_sparkle_color   ¾  fragColor   G  !        G  !  "       G  !  !      G  "        G  "  "       G  "  !      G  .        G  .  "       G  .  !      G  /        G  /  "       G  /  !      G  :        G  :  "       G  :  !      G  ;        G  ;  "       G  ;  !      G  Z        G  _        G  _  "       G  _  !      G  e     	   G  e  "       G  e  !   	   G  k        G  k  "       G  k  !      G  m        G  m  "       G  m  !      G  u        G  u  "       G  u  !      G  x        G  x  "       G  x  !      G       
   G    "       G    !   
   G          G    "       G    !      G          G    "       G    !      G           G    "       G    !       G  ±        G  ±  "       G  ±  !      G  ¾              !                                       +     >       +     ?     ?+     D   'Â¬@+     E   ¯%®@,     F   D   E   +     L   ãG¬A+     M   êeA,     N   L   M     U           +     ^   Ü¾B+     b   fB+           ?+     à   ÍÌL=+     ç   ÛI@+     é   33³>+     î   ÍÌÌ=+     ï   >+     ø   333?+     ý   ÍÌL>+     þ     >+       ff?+       >+       ÍÌ?+       ÍÌL?,                        ;     !      ;     "      +     #  {.>;     .      ;     /      ;     :      ;     ;      +     <  ÍÌ>+     O  ffæ>  X           Y     X  ;  Y  Z     ;     _      ;     e         j         ;  j  k      ;  j  m      ;     u      ;  j  x      ;  j        ;  j        ;  j                 X  ;          +  U           ¦        ;    ±         ½     X  ;  ½  ¾     ,     ¡  #  #  ,     ¢  ý   ý   ,     £  <  <  +     ¯  ÍÌÌ>+     °     ?,     ±  °  °  +     Ã  Ù=,     Å  Ã  Ã  +     Ç    :¿+     È   .@+     É  ¬gA+     Ê     >,     Ì  Ê  Ê  +     Î    ¿+     Ï    B@+     Ð  OìDA+     Ñ    0>,     Ó  Ñ  Ñ  +     Õ   å¿+     Ö   Àr@+     ×  7A6               ø          _       =  X  [  Z  O     \  [  [              `       =     `  _       a  \  `       a       =     f  e       g  \  f       h  a  g       b       =     l  k  =     n  m       o  l  n       V            ß  a         W       =     á  !  =     â  "       5       Q     !  â      Q     #  â          $  #  P     )  !  $  P     *  #  !  P     +  )  *       E              á  ß         +             á       F                ¡           ±       :            4     C     Å       ;            ;  4  É       <     1   Ç  È  ;       =  ?   <       X       =     å  .  =     æ  /       5       Q     f  æ      Q     h  æ          i  h  P     n  f  i  P     o  h  f  P     p  n  o       E            K  å  ß       L  p  K       N  L  å       F            R  N  ¢       T  R  ±       :            y     C   T  Ì       ;              y  Ð            1   Î  Ï           ?          Y       =     é  :  =     ê  ;       5       Q     «  ê      Q     ­  ê          ®  ­  P     ³  «  ®  P     ´  ­  «  P     µ  ³  ´       E              é  ß         µ             é       F                £           ±       :            ¾     C     Ó       ;            Å  ¾  ×       Æ     1   Õ  Ö  Å       Ç  ?   Æ       Z            î  =  =       ð  î         ò  ð  Ç       [            õ  ò  ¯       ö  O  õ       &            Ë     +   ö  >   ?        d            w  à   l  =     |  u  =       x       ?            Û  o  w       9            ñ            :            ô     C   \  |       ;            ö  ?   ñ       ø  ?   ñ       û  ô  Û       ü     1   ö  ø  û       ý  ?   ü       @            â  o  w       ã     (   â  >        ;              ô  ã            1   ö  ø           ?          A            ê  ý         &                 +   ê  >   ?        e       =              *            L  h  F        M     
   L       +       O     O  M  M              Q  M  N        R  O  Q  P     T  R  R       U  M  T       ,       Q     W  U      Q     Y  U          Z  W  Y       -            \  Z  ^        ]     
   \       _  Z  b        `     
   _       a  ]  `       b  a  ?        1            g     0   >   b       j     0   à   b       k  ?   j       l  g  k       O            ,    é        -  ç   ,       .        -       /  b  .       1            q     0   î   /       t     0   ï   /       u  ?   t       v  q  u       O            2  l  v       P            5    ø        6  ç   5       7        6       8  b  7       1            {     0   ý   8       ~     0   þ   8         ?   ~         {         P            ;  2         Q            >           ?  ç   >       @        ?       A  b  @       1                 0     A            0   é   A         ?                     Q            D  ;         &                 +   D  >   ?        R            G           e              G             Ë  =                         ;              ô  o            1   ö  ø            ?          f       =                     A  j  ¡       =     ¢  ¡       £    ¢       g       =  X  §    O  ¦  ¨  §  §              ¦  ª  ¨  £  Q     ¬  ª      Q     ­  ª     Q     ®  ª     P  X  ¯  ¬  ­  ®  £       h       =  X  ²  ±  O  ¦  ³  ²  ²            A  j  ´  ±     =     µ  ´    ¦  ¶  ³  µ  Q     ¹  ¶      Q     º  ¶     Q     »  ¶     P  X  ¼  ¹  º  »  µ       i       P  X  Â            X  Ã     .   ¯  ¼  Â  >  ¾  Ã  ý  8  