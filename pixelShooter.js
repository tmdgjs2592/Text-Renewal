import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

export class PixelShooter extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.player_position = vec3(-18, -1, 0); // Initial position
        this.player_position2 = vec3(18, -4.5, 0);
        
        this.player_velocity = vec3(0, 0, 0); // Velocity
        this.player_velocity2 = vec3(0, 0, 0);
        
        this.on_ground = false;
        this.on_ground2 = true;
        
        this.projectiles = []; // Array to hold active projectiles
        this.projectiles2 = [];
        
        this.direction = 40;
        this.direction2 = -40;

        this.on_platform = false;
        this.on_platform2 = false;

        this.s_clicked = false;
        this.s_clicked2 = false;

        this.shoot_CD = 0;
        this.shoot_CD2 = 0;
        
        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            torus: new defs.Torus(15, 15),
            torus2: new defs.Torus(3, 15),
            sphere: new defs.Subdivision_Sphere(4),
            circle: new defs.Regular_2D_Polygon(1, 15),
            sphere1: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(1),
            sphere2: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(2),
            sphere3: new defs.Subdivision_Sphere(3),
            sphere4: new defs.Subdivision_Sphere(4),
            ring: new defs.Torus(30, 100),

            // Pixel Shooter
            player: new defs.Square(),
            player2: new defs.Square(),
            platform: new defs.Square(),
            projectile: new defs.Square(),
        };

        // *** Materials
        this.materials = {
            test: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            test2: new Material(new Gouraud_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#992828")}),
            ring: new Material(new Ring_Shader()),
            sun_material: new Material(new defs.Phong_Shader(),
                {ambient: 1.0, diffusivity: 0.6, color: hex_color("#ff0000")}),
            planet1_material: new Material(new defs.Phong_Shader(),
                {ambient: 0, diffusivity: 1, color: hex_color("#808080")}),
            planet2_phong_material: new Material(new defs.Phong_Shader(),
                {ambient: 0, specularity: 1, diffusivity: 0.2, color: hex_color("#80FFFF")}),
            planet2_gouraud_material: new Material(new Gouraud_Shader(),
                {ambient: 0, specularity: 1, diffusivity: 0.2, color: hex_color("#80FFFF")}),
            planet3_material: new Material(new defs.Phong_Shader(),
                {ambient: 0, specularity: 1, diffusivity: 1, color: hex_color("#B08040")}),
            ring_material: new Material(new Ring_Shader(),
                {ambient: 1, specularity: 0, diffusivity: 0, color: hex_color("#B08040")}),
            planet4_material: new Material(new defs.Phong_Shader(),
                {ambient: 0, specularity: 0.8, diffusivity: 0.5, color: hex_color("#1A4D8F")}),
            moon_material: new Material(new defs.Phong_Shader(),
                {ambient: 0, specularity: 0.8, diffusivity: 0.5, color: hex_color("#95018b")}),

            // Pixel Shooter
            player_material: new Material(new defs.Phong_Shader(),
                { color: hex_color("#FE5F55") }),
            player_material2: new Material(new defs.Phong_Shader(),
                { color: hex_color("#ABCDEF") }),
            platform_material: new Material(new defs.Phong_Shader(),
                { color: hex_color("#034F20") }),
            projectile_material: new Material(new defs.Phong_Shader(),
                { color: hex_color("#808080") }),
        }

        this.initial_camera_location = Mat4.look_at(
            vec3(0, 0, 30), // Camera directly above the player
            vec3(0, 0, 0),  // Looking at the origin
            vec3(0, 1, 0)   // 'Up' is along the y-axis
        );
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Move Left", ["ArrowLeft"], () => {
            this.player_velocity2[0] = -10; // Move left
            this.direction2 = -40;
        }, undefined, () => {
            this.player_velocity2[0] = 0; // Stop moving when key is released
        });
        this.new_line();
        this.key_triggered_button("Move Right", ["ArrowRight"], () => {
            this.player_velocity2[0] = 10; // Move right
            this.direction2 = 40;
        }, undefined, () => {
            this.player_velocity2[0] = 0; // Stop moving when key is released
            
        });
        this.new_line();
        this.key_triggered_button("Jump", ["ArrowUp"], () => {
            if (this.on_ground2) { // Only jump if on the ground
                this.on_ground2 = false;
                this.player_velocity2[1] = 25; // Jump velocity
            }
        });
        
        this.new_line();
        
        this.key_triggered_button("Move Down", ["ArrowDown"], () => {
            if(this.on_platform2){
                this.on_ground2 = false;
                this.on_platform2 = false;
                this.player_velocity2[1] = -15;
                this.s_clicked2 = true;
            }}, undefined, () => {
                this.s_clicked2 = false;
        });
        
        this.new_line();
        
        this.key_triggered_button("Shoot", ["Shift"], () => {
            // Create a new projectile
            if(this.shoot_CD2 === 0){
                let projectile = {
                    position: this.player_position2.plus(vec3(0, 0.5, 0)), // Adjust as needed to align with player
                    velocity: vec3(this.direction2, 0, 0) // Adjust the speed and direction
                };
                this.projectiles.push(projectile);
                this.shoot_CD2 = 0.5;
            }
            
        });
        

        this.new_line();
        this.new_line();
        
        this.key_triggered_button("Move Left", ["a"], () => {
            this.player_velocity[0] = -10; // Move left
            this.direction = -40;
        }, undefined, () => {
            this.player_velocity[0] = 0; // Stop moving when key is released
        });
        this.new_line();
        this.key_triggered_button("Move Right", ["d"], () => {
            this.player_velocity[0] = 10; // Move right
            this.direction = 40;
        }, undefined, () => {
            this.player_velocity[0] = 0; // Stop moving when key is released
        });
        this.new_line();
        this.key_triggered_button("Jump", ["w"], () => {
            if (this.on_ground) { // Only jump if on the ground
                this.on_ground = false;
                this.on_platform = false;
                this.player_velocity[1] = 25; // Jump velocity
            }
        });
        this.new_line();
        this.key_triggered_button("Move down", ["s"], () => {
            if(this.on_platform){
                this.on_ground = false;
                this.on_platform = false;
                this.player_velocity[1] = -15;
                this.s_clicked = true;
            }}, undefined, () => {
                this.s_clicked = false;
        });
        this.new_line();
        this.key_triggered_button("Shoot", ["q"], () => {
            // Create a new projectile
            if(this.shoot_CD === 0){
                let projectile = {
                    position: this.player_position.plus(vec3(0, 0.5, 0)), // Adjust as needed to align with player
                    velocity: vec3(this.direction, 0, 0) // Adjust the speed and direction
                };
                this.projectiles.push(projectile);
                this.shoot_CD = 0.5;
            }
            
        });

        
    }

    check_collision(player_position, player_size, platform_position, platform_size, player_velocity) {
        // AABB collision detection
        let player_left = player_position[0] - player_size[0] / 2;
        let player_right = player_position[0] + player_size[0] / 2;
        let player_top = player_position[1] + player_size[1] / 2;
        let player_bottom = player_position[1] - player_size[1] / 2;

        let platform_left = platform_position[0] - platform_size[0] / 2;
        let platform_right = platform_position[0] + platform_size[0] / 2;
        let platform_top = platform_position[1] + platform_size[1] / 2;
        let platform_bottom = platform_position[1] - platform_size[1] / 2;

        // Check if player and platform overlap
        return player_left < platform_right && player_right > platform_left &&
            player_bottom < platform_top && player_velocity && player_top > platform_bottom && player_top > platform_top &&  player_velocity[1] <= 0 && (!this.s_clicked || this.s_clicked2);
    }

    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        // if (!context.scratchpad.controls) {
        //     this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
        //     // Define the global camera and projection matrices, which are stored in program_state.
        //     program_state.set_camera(this.initial_camera_location);
        // }

        program_state.set_camera(this.initial_camera_location);
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        // Lights
        // The parameters of the Light are: position, color, size
        const light_position = vec4(0, -20, 20, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 10000)];

        this.on_ground = false;

        // Projectiles
        // Update and draw projectiles
        this.shoot_CD = Math.max(0, this.shoot_CD - dt);
        this.shoot_CD2 = Math.max(0, this.shoot_CD2 - dt);
        
        for (let projectile of this.projectiles) {
            // Update position based on velocity
            projectile.position = projectile.position.plus(projectile.velocity.times(dt));

            // Draw the projectile
            let projectile_transform = Mat4.translation(...projectile.position)
                .times(Mat4.scale(0.4, 0.2, 0.2)); // Scale down the size
            this.shapes.projectile.draw(context, program_state, projectile_transform, this.materials.projectile_material);
        }

        if (this.projectiles.length > 50) {
            this.projectiles = this.projectiles.slice(9);
        }

        // Collision Logic
        let player_size = vec(1, 1); // Width and height of the player
        let platforms = [
            {
                position: vec3(0, -6, 0),
                size: vec(60, 2),
            },
            {
                position: vec3(-18, 5, 0),
                size: vec(10, 2),
            },
            {
                position: vec3(-6, -1.5, 0),
                size: vec(10, 2),
            },
            {
                position: vec3(8, 0.5, 0),
                size: vec(10, 2),
            },
            {
                position: vec3(18, 5, 0),
                size: vec(10, 2),
            },
        ]
        
        for (let platform of platforms) {
            if (this.check_collision(this.player_position, player_size, platform.position, platform.size, this.player_velocity)) {
                if(platform.size[0] < 40)
                    this.on_platform = true;
                else
                    this.on_platform = false;
                this.on_ground = true;
                this.player_velocity[1] = 0;
                this.player_position[1] = (platform.position[1] + platform.size[1] / 2 + player_size[1] / 2); // Adjust player position to be on top of the platform
            }
        }
        
        for (let platform of platforms) {
            if (this.check_collision(this.player_position2, player_size, platform.position, platform.size, this.player_velocity2)) {
                if(platform.size[0] < 40)
                    this.on_platform2 = true;
                else
                    this.on_platform2 = false;
                this.on_ground2 = true;
                this.player_velocity2[1] = 0;
                this.player_position2[1] = (platform.position[1] + platform.size[1] / 2 + player_size[1] / 2); // Adjust player position to be on top of the platform
            }
        }

        if (!this.on_ground) {
            this.player_velocity[1] -= 25 * 1.5* dt; // Continue applying gravity
            
        }
        if(!this.on_ground2){
            this.player_velocity2[1] -= 25 * 1.5 * dt;
        }
        
            
        // Update player position
        
        if (this.player_position[0] + this.player_velocity[0] / 60 >= -21.5 && this.player_position[0] + (this.player_velocity[0] / 60) <= 21.5) {
            this.player_position = this.player_position.plus(this.player_velocity.times(dt));
        } else {
            this.player_velocity[0] = 0;
        }
        if(this.player_position2[0] + this.player_velocity2[0] / 60 >= -21.5 && this.player_position2[0] + (this.player_velocity2[0]/60) <= 21.5){
            this.player_position2 = this.player_position2.plus(this.player_velocity2.times(dt));
        }
        else{
            this.player_velocity2[0] = 0;
        }

        // Drawing Player
        let player_transform = Mat4.translation(...this.player_position);
        let player_transform2 = Mat4.translation(...this.player_position2);
        
        // Ground Platform
        let ground_platform_transform = Mat4.identity()
            .times(Mat4.translation(0, -6, 0))
            .times(Mat4.scale(30, 0.5, 1));

        // Small Platforms
        let platform_transform1 = Mat4.identity()
            .times(Mat4.translation(-18, 5, 0))
            .times(Mat4.scale(5, 0.5, 1));

        let platform_transform2 = Mat4.identity()
            .times(Mat4.translation(-6, -1.5, 0))
            .times(Mat4.scale(5, 0.5, 1));

        let platform_transform3 = Mat4.identity()
            .times(Mat4.translation(8, 0.5, 0))
            .times(Mat4.scale(5, 0.5, 1));

        let platform_transform4 = Mat4.identity()
            .times(Mat4.translation(18, 5, 0))
            .times(Mat4.scale(5, 0.5, 1));

        // Draw All Shapes
        this.shapes.player.draw(context, program_state, player_transform, this.materials.player_material);

        this.shapes.player2.draw(context, program_state, player_transform2, this.materials.player_material2);
        
        this.shapes.platform.draw(context, program_state, platform_transform1, this.materials.platform_material);

        this.shapes.platform.draw(context, program_state, platform_transform2, this.materials.platform_material);

        this.shapes.platform.draw(context, program_state, platform_transform3, this.materials.platform_material);

        this.shapes.platform.draw(context, program_state, platform_transform4, this.materials.platform_material);

        this.shapes.platform.draw(context, program_state, ground_platform_transform, this.materials.platform_material);

    }
}

class Gouraud_Shader extends Shader {
    // This is a Shader using Phong_Shader as template
    // TODO: Modify the glsl coder here to create a Gouraud Shader (Planet 2)

    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return ` 
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        varying vec4 vertex_color;
        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                                               light_positions_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;                            
            // Position is expressed in object coordinates.
            
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
    
            void main(){                                                                   
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;
                

                vertex_color = vec4( shape_color.xyz * ambient, shape_color.w );
                // Compute the final color with contributions from lights:
                vertex_color.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
            } `;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            void main(){                                                           

                gl_FragColor = vertex_color;
            } `;
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}

class Ring_Shader extends Shader {
    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
        const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
            Matrix.flatten_2D_to_1D(PCM.transposed()));
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        varying vec4 point_position;
        varying vec4 center;
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        attribute vec3 position;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;
        
        // varying vec4 point_position;
        // varying vec4 center;
        void main(){
            vec4 object_space_pos = vec4(position, 1.0);
            point_position = model_transform * object_space_pos;
            center = model_transform * vec4(0.0, 0.0, 0.0, 1.0);

            gl_Position = projection_camera_model_transform * object_space_pos;
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        precision mediump float;

        void main(){
            float distance_from_center = distance(point_position, center); // Calculate distance from the center
            float frequency = 10.0; // Increase for more bands
            float sharpness = 0.9;  // Adjust for sharper or softer transitions            
            
            float color_intensity = abs(sin(distance_from_center * frequency));
            color_intensity = color_intensity > sharpness ? 1.0 : 0.0;
            
            vec4 ring_color = vec4(0.69, 0.50, 0.25, 1); // Color of Planet 3 (muddy brown-orange)
            gl_FragColor = vec4(ring_color.rgb * color_intensity, ring_color.a); // Apply color intensity
        }`;
    }
}

