#include <iostream>
#include <cmath> // Include cmath for sin function
#include "portaudio.h"

#define SAMPLE_RATE (44100)
#define FRAMES_PER_BUFFER (64)
#define NUM_SECONDS (5)
#define NUM_CHANNELS (2)

#ifndef M_PI
#define M_PI  (3.14159265)
#endif

typedef struct {
    float phase;
    float phaseIncrement;
} paTestData;

// This callback function will be called by PortAudio when audio is needed
static int paCallback(const void *inputBuffer, void *outputBuffer,
                      unsigned long framesPerBuffer,
                      const PaStreamCallbackTimeInfo *timeInfo,
                      PaStreamCallbackFlags statusFlags,
                      void *userData)
{
    paTestData *data = (paTestData*)userData;
    float *out = (float*)outputBuffer;
    unsigned int i;

    (void) inputBuffer; // Prevent unused variable warning

    for (i = 0; i < framesPerBuffer; i++)
    {
        *out++ = 0.5f * static_cast<float>(sin(data->phase)); // Left
        *out++ = 0.5f * static_cast<float>(sin(data->phase)); // Right
        data->phase += data->phaseIncrement;
        if (data->phase > 2.0f * M_PI)
            data->phase -= 2.0f * M_PI;
    }

    return paContinue;
}

int main()
{
    PaError err;
    PaStream *stream;
    paTestData data;
    int numSamples = NUM_SECONDS * SAMPLE_RATE;
    int numBytes = numSamples * sizeof(float);

    // Initialize PortAudio
    err = Pa_Initialize();
    if (err != paNoError) {
        std::cerr << "PortAudio initialization failed: " << Pa_GetErrorText(err) << std::endl;
        return 1;
    }

    // Set up parameters for sine wave generation
    data.phase = 0.0f;
    data.phaseIncrement = 440.0f * 2.0f * static_cast<float>(M_PI) / static_cast<float>(SAMPLE_RATE);

    // Open an audio stream
    err = Pa_OpenDefaultStream(&stream,
                               0,  // no input channels
                               NUM_CHANNELS,  // stereo output
                               paFloat32,  // 32-bit floating point output
                               SAMPLE_RATE,
                               FRAMES_PER_BUFFER,
                               paCallback,
                               &data);
    if (err != paNoError) {
        std::cerr << "PortAudio error: " << Pa_GetErrorText(err) << std::endl;
        Pa_Terminate();
        return 1;
    }

    // Start the stream
    err = Pa_StartStream(stream);
    if (err != paNoError) {
        std::cerr << "PortAudio error: " << Pa_GetErrorText(err) << std::endl;
        Pa_CloseStream(stream);
        Pa_Terminate();
        return 1;
    }

    std::cout << "Playing sine wave for " << NUM_SECONDS << " seconds..." << std::endl;
    Pa_Sleep(NUM_SECONDS * 1000); // Sleep for NUM_SECONDS seconds

    // Stop and close the stream
    err = Pa_StopStream(stream);
    if (err != paNoError) {
        std::cerr << "PortAudio error: " << Pa_GetErrorText(err) << std::endl;
    }
    err = Pa_CloseStream(stream);
    if (err != paNoError) {
        std::cerr << "PortAudio error: " << Pa_GetErrorText(err) << std::endl;
    }

    // Terminate PortAudio
    Pa_Terminate();

    std::cout << "Finished playing sine wave." << std::endl;

    return 0;
}
