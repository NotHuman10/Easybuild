using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.Primitives;
using System;
using System.IO;

namespace Easybuild.API.Services
{
    public class ImageConverter
    {
        public (int Width, int Height) GetDimensions(Stream imgStream)
        {
            imgStream.Seek(0, SeekOrigin.Begin);
            var info = Image.Identify(imgStream);
            imgStream.Seek(0, SeekOrigin.Begin);
            return (info.Width, info.Height);
        }

        public Stream Resize(Stream imgStream, int width, int height)
        {
            imgStream.Seek(0, SeekOrigin.Begin);
            using (Image<Rgba32> imgObj = Image.Load<Rgba32>(imgStream, out IImageFormat format))
            {
                imgObj.Mutate(i => i.Resize(new Size(width, height)));
                var output = new MemoryStream();
                imgObj.Save(output, format);
                imgStream.Seek(0, SeekOrigin.Begin);
                output.Seek(0, SeekOrigin.Begin);
                return output;
            }
        }

        public Stream Scale(Stream imgStream, double percent)
        {
            imgStream.Seek(0, SeekOrigin.Begin);
            var dimensions = GetDimensions(imgStream);
            using (Image<Rgba32> imgObj = Image.Load<Rgba32>(imgStream, out IImageFormat format))
            {
                var newWidth = (int)Math.Ceiling(dimensions.Width * percent);
                var newHeight = (int)Math.Ceiling(dimensions.Height * percent);
                imgObj.Mutate(i => i.Resize(new Size(newWidth, newHeight)));
                var output = new MemoryStream();
                imgObj.Save(output, format);
                imgStream.Seek(0, SeekOrigin.Begin);
                output.Seek(0, SeekOrigin.Begin);
                return output;
            }
        }

        public Stream FitContain(Stream imgStream, int width, int height)
        {
            var dimensions = GetDimensions(imgStream);
            double wPerc = (double)width / dimensions.Width;
            double hPerc = (double)height / dimensions.Height;

            return Scale(imgStream, wPerc < hPerc ? wPerc : hPerc);
        }

        public Stream FitCover(Stream imgStream, int width, int height)
        {
            var dimensions = GetDimensions(imgStream);
            double wPerc = (double)width / dimensions.Width;
            double hPerc = (double)height / dimensions.Height;

            return Scale(imgStream, wPerc > hPerc ? wPerc : hPerc);
        }
    }
}