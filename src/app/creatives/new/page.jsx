"use client";
import React, { useState } from 'react';
import { Platforms } from '../../../util/platformUtil';
import { FacebookIcon, InstagramIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import api from '@/conf/api';
import AWS from 'aws-sdk';
import { Table, Tag, Space, Typography, Progress, Button, Modal, Image, Spin } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

const UploadBaselineCreative = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        campaign: '',
        formatType: '',
        tags: [],
        dynamicElements: {
            productName: false,
            price: false,
            callToAction: false,
            background: false
        },
        image: null,
        selectedPlatforms: [] // No pre-selected platforms
    });

    const [newTag, setNewTag] = useState('');
    const [creativeData, setCreativeData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [creativeCreated, setCreativeCreated] = useState(false);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');

    // Platform data with logos, names, and ad types
    const platformData = {
        [Platforms.FACEBOOK]: {
            name: 'Facebook',
            logo: <FacebookIcon />,
            adTypes: ['Feed', 'Stories', 'Carousel'],
            sizes: [
                { size: '1080x1080', ratio: '1:1', width: 1080, height: 1080, placement: 'Feed' },
                { size: '1080x1920', ratio: '9:16', width: 1080, height: 1920, placement: 'Stories' },
                { size: '1200x628', ratio: '16:9', width: 1200, height: 628, placement: 'Link' }
            ]
        },
        [Platforms.INSTAGRAM]: {
            name: 'Instagram',
            logo: <InstagramIcon />,
            adTypes: ['Feed', 'Stories', 'Reels'],
            sizes: [
                { size: '1080x1080', ratio: '1:1', width: 1080, height: 1080, placement: 'Feed' },
                { size: '1080x1920', ratio: '9:16', width: 1080, height: 1920, placement: 'Stories' }
            ]
        },
        [Platforms.GOOGLE]: {
            name: 'Google Ads',
            logo: <span className="text-lg">🔍</span>,
            adTypes: ['Display', 'Banner', 'Responsive'],
            sizes: [
                { size: '300x300', ratio: '1:1', width: 300, height: 300, placement: 'Display' },
                { size: '728x90', ratio: '16:9', width: 728, height: 90, placement: 'Banner' },
                { size: '300x250', ratio: '16:9', width: 300, height: 250, placement: 'Display' },
                { size: '320x50', ratio: '16:9', width: 320, height: 50, placement: 'Banner' },
                { size: '970x90', ratio: '16:9', width: 970, height: 90, placement: 'Banner' },
                { size: '970x250', ratio: '16:9', width: 970, height: 250, placement: 'Display' }
            ]
        },
        [Platforms.PINTEREST]: {
            name: 'Pinterest',
            logo: <span className="text-lg">📌</span>,
            adTypes: ['Standard', 'Video Pins'],
            sizes: [
                { size: '1000x1500', ratio: '2:3', width: 1000, height: 1500, placement: 'Standard' },
                { size: '1000x1000', ratio: '1:1', width: 1000, height: 1000, placement: 'Standard' }
            ]
        },
        [Platforms.TIKTOK]: {
            name: 'TikTok',
            logo: <span className="text-lg">🎵</span>,
            adTypes: ['In-Feed', 'TopView'],
            sizes: [
                { size: '1080x1920', ratio: '9:16', width: 1080, height: 1920, placement: 'In-Feed' },
                { size: '1080x1920', ratio: '9:16', width: 1080, height: 1920, placement: 'TopView' }
            ]
        },
        [Platforms.LINKEDIN]: {
            name: 'LinkedIn',
            logo: <span className="text-lg">💼</span>,
            adTypes: ['Feed', 'Message Ads'],
            sizes: [
                { size: '1200x628', ratio: '1.91:1', width: 1200, height: 628, placement: 'Feed' },
                { size: '1200x1200', ratio: '1:1', width: 1200, height: 1200, placement: 'Feed' }
            ]
        },
        [Platforms.TWITTER]: {
            name: 'Twitter',
            logo: <span className="text-lg">🐦</span>,
            adTypes: ['Image', 'Carousel'],
            sizes: [
                { size: '1200x675', ratio: '16:9', width: 1200, height: 675, placement: 'Image' },
                { size: '1200x1200', ratio: '1:1', width: 1200, height: 1200, placement: 'Carousel' }
            ]
        },
        [Platforms.SNAPCHAT]: {
            name: 'Snapchat',
            logo: <span className="text-lg">👻</span>,
            adTypes: ['Story Ads', 'Filters'],
            sizes: [
                { size: '1080x1920', ratio: '9:16', width: 1080, height: 1920, placement: 'Story Ads' }
            ]
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDynamicElementChange = (element) => {
        setFormData(prev => ({
            ...prev,
            dynamicElements: {
                ...prev.dynamicElements,
                [element]: !prev.dynamicElements[element]
            }
        }));
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const [uploading, setUploading] = useState(false);

    // Configure AWS
    const configureAWS = () => {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
            region: process.env.NEXT_PUBLIC_AWS_REGION
        });
    };

    const uploadToS3 = async (file) => {
        try {
            setUploading(true);
            
            // Configure AWS
            configureAWS();
            
            // Create S3 instance
            const s3 = new AWS.S3();
            
            // Generate unique filename
            const fileExtension = file.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExtension}`;
            
            // Upload parameters
            const uploadParams = {
                Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
                Key: `creatives/${fileName}`,
                Body: file,
                ContentType: file.type,
                // ACL: 'public-read' // Make the file publicly accessible
            };
            
            // Upload to S3
            const result = await s3.upload(uploadParams).promise();
            console.log('result', result);
            return result.Location; // Return the S3 URL
            
        } catch (error) {
            console.error('Error uploading to S3:', error);
            throw error;
        } finally {
            setUploading(false);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                setUploading(true);
                
                // Store file temporarily for preview
                setFormData(prev => ({
                    ...prev,
                    image: file
                }));

                // Upload to S3 and get URL
                const s3Url = await uploadToS3(file);
                
                // Update form data with S3 URL
                setFormData(prev => ({
                    ...prev,
                    imageUrl: s3Url // Store the S3 URL separately
                }));

            } catch (error) {
                console.error('Upload failed:', error);
                // You might want to show an error message to the user here
                alert('Failed to upload image. Please try again.');
            } finally {
                setUploading(false);
            }
        }
    };

    const handlePlatformToggle = (platform) => {
        setFormData(prev => ({
            ...prev,
            selectedPlatforms: prev.selectedPlatforms.includes(platform)
                ? prev.selectedPlatforms.filter(p => p !== platform)
                : [...prev.selectedPlatforms, platform]
        }));
    };

    // Prepare creative sizes table data from API response
    const prepareCreativeSizesData = () => {
        if (!creativeData?.image_data) return [];

        const tableData = [];
        
        Object.entries(creativeData.image_data).forEach(([platform, aspectRatios]) => {
            Object.entries(aspectRatios).forEach(([ratio, imageData]) => {
                const platformInfo = platformData[platform];
                if (platformInfo) {
                    tableData.push({
                        key: `${platform}-${ratio}`,
                        platform,
                        platformName: platformInfo.name,
                        platformIcon: platformInfo.logo,
                        placement: platformInfo.sizes?.find(s => s.size === ratio)?.placement || 'Unknown',
                        size: ratio,
                        ratio: platformInfo.sizes?.find(s => s.size === ratio)?.ratio || 'Unknown',
                        dimensions: ratio,
                        width: parseInt(ratio.split('x')[0]),
                        height: parseInt(ratio.split('x')[1]),
                        imageData: imageData // The actual generated image data
                    });
                }
            });
        });
        
        return tableData.sort((a, b) => {
            if (a.platform !== b.platform) {
                return a.platform.localeCompare(b.platform);
            }
            return b.width - a.width;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        
        try {
            const uuid = uuidv4();
            const newCreative = {
                ...formData,
                add_item_id: uuid
            }
            console.log('Form submitted:', newCreative);
            
            // Create the creative
            const createResponse = await api.post('/creative/add-new-creative', newCreative);
            console.log('Create Response:', createResponse);
            
            // Get the creative_id from the response
            const creativeId = createResponse.data.creative_id;
            
            // Fetch the creative data with all the generated sizes
            const fetchResponse = await api.get(`/creative/${creativeId}`);
            console.log('Fetch Response:', fetchResponse);
            
            setCreativeData(fetchResponse.data);
            setCreativeCreated(true);
            
        } catch (error) {
            console.error('Error creating/fetching creative:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch preview image from API
    const fetchPreviewImage = async (platform, size) => {
        console.log('fetchPreviewImage called with:', { platform, size });
        
        setPreviewTitle(`${platformData[platform]?.name || platform} ${size}`);
        setPreviewModalVisible(true);
        
        try {
            setPreviewLoading(true);
            const adTag = `${platform}/${size}`;
            console.log('Making API call with adTag:', adTag);
            
            const response = await fetch('https://hackathon-creative-api.onrender.com/creative', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ adTag }),
            });
            
            console.log('API response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('API response data:', data);
                
                // Handle different response formats
                let imageUrl = null;
                
                if (data.s3_url) {
                    // Direct s3_url in response
                    imageUrl = data.s3_url;
                } else if (data.creative && data.creative.versions && data.creative.versions.length > 0) {
                    // Nested creative.versions structure
                    imageUrl = data.creative.versions[0].imageUrl;
                } else if (data.imageUrl) {
                    // Direct imageUrl in response
                    imageUrl = data.imageUrl;
                }
                
                if (imageUrl) {
                    console.log('Using image URL:', imageUrl);
                    setPreviewImage(imageUrl);
                } else {
                    console.error('No image URL found in response');
                    setPreviewImage('');
                }
            } else {
                console.error('Failed to fetch preview image, status:', response.status);
                setPreviewImage('');
            }
        } catch (error) {
            console.error('Error fetching preview image:', error);
            setPreviewImage('');
        } finally {
            setPreviewLoading(false);
        }
    };

  return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <form onSubmit={handleSubmit}>
                    {/* Section 1: Upload Baseline Creative */}
                    <div className="bg-white rounded-lg shadow-sm">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900">Upload Baseline Creative</h1>
                            <p className="mt-2 text-gray-600">
                                Add details and upload your base creative that will be adapted to different platforms and sizes.
                            </p>
                        </div>

                        <div className="px-8 py-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column - Creative Details */}
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Creative Details</h2>
                                    
                                    {/* Creative Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Creative Title *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            placeholder="Enter a title for your creative."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            required
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder="Enter a description for your creative."
                                            rows={4}
                                            maxLength={150}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Brief description of the creative. Maximum 150 characters.
                                        </p>
                                    </div>

                                    {/* Campaign */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Campaign *
                                        </label>
                                        <select
                                            required
                                            value={formData.campaign}
                                            onChange={(e) => handleInputChange('campaign', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select a campaign</option>
                                            <option value="Summer Collection 2025">Summer Collection 2025</option>
                                            <option value="Winter Collection 2025">Winter Collection 2025</option>
                                            <option value="Spring Collection 2025">Spring Collection 2025</option>
                                        </select>
                                    </div>

                                    {/* Format Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Format Type *
                                        </label>
                                        <select
                                            required
                                            value={formData.formatType}
                                            onChange={(e) => handleInputChange('formatType', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select format type</option>
                                            <option value="Display">Display</option>
                                            <option value="Video">Video</option>
                                            <option value="Social">Social</option>
                                            <option value="Banner">Banner</option>
                                        </select>
                                    </div>

                                    {/* Tags */}
            <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tags
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {formData.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
            </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                placeholder="Add a tag..."
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                            />
                                            <button
                                                type="button"
                                                onClick={addTag}
                                                className="px-4 py-2 bg-black text-white rounded-md cursor-pointer hover:bg-black/80 hover:text-white! focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                Add
                </button>
            </div>
        </div>

                                    {/* Dynamic Elements */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dynamic Elements
                                        </label>
                                        <div className="space-y-2">
                                            {Object.entries(formData.dynamicElements).map(([key, value]) => (
                                                <label key={key} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={value}
                                                        onChange={() => handleDynamicElementChange(key)}
                                                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700 capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Select elements that will be dynamically personalized.
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column - Image Upload and Requirements */}
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Image Upload and Requirements</h2>
                                    
                                    {/* Base Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Base Image (1:1) *
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                            {formData.image ? (
                                                <div>
                                                    <img
                                                        src={URL.createObjectURL(formData.image)}
                                                        alt="Preview"
                                                        className="mx-auto max-w-full max-h-64 rounded-lg"
                                                    />
                                                    <p className="mt-2 text-sm text-gray-600">{formData.image.name}</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="mx-auto w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                                                        <span className="text-gray-500">No image selected</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-4">
                                                        Drag and drop your image here or click to browse files.
                                                    </p>
                                                </div>
                                            )}
                                            <label className={`inline-flex items-center px-4 py-2 rounded-md cursor-pointer ${
                                                uploading 
                                                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                                                    : 'bg-black text-white hover:bg-black/80! hover:text-white!'
                                            }`}>
                                                {uploading ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                        Upload Image
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    required
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    disabled={uploading}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Image Requirements */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">Image Requirements</h3>
                                        <div className="space-y-2">
                                            {[
                                                'Square format (1:1 aspect ratio)',
                                                'High resolution (minimum 1080x1080px)',
                                                'Less than 20% text in the image',
                                                'Clear focal point that works across sizes',
                                                'Supported formats: JPG, PNG, GIF (Max: 5MB)'
                                            ].map((requirement, index) => (
                                                <div key={index} className="flex items-center">
                                                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm text-gray-600">{requirement}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Select Platforms */}
                    <div className="bg-white rounded-lg shadow-sm mt-12">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900">Select Platforms</h1>
                            <p className="mt-2 text-gray-600">
                                Choose the platforms where you want to run your ads. We'll generate appropriate sizes for each.
                            </p>
                        </div>

                        <div className="px-8 py-6">
                            {/* Platform Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {Object.entries(platformData).map(([platformKey, platform]) => (
                                    <div
                                        key={platformKey}
                                        className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                                            formData.selectedPlatforms.includes(platformKey)
                                                ? 'border-black '
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => handlePlatformToggle(platformKey)}
                                    >
                                        <div className="flex items-start space-x-4">
                                            <input
                                                type="checkbox"
                                                checked={formData.selectedPlatforms.includes(platformKey)}
                                                onChange={() => handlePlatformToggle(platformKey)}
                                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <span className="text-2xl">{platform.logo}</span>
                                                    <h3 className="text-lg font-semibold text-gray-900">{platform.name}</h3>
                                                </div>
                                                <div className="space-y-1">
                                                    {platform.adTypes.map((adType, index) => (
                                                        <p key={index} className="text-sm text-gray-600">
                                                            • {adType}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Informational Note */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-start space-x-3">
                                    <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-gray-700">
                                        Based on your platform selection, we'll automatically generate the appropriate creative sizes. You can customize each variation in the next step.
                                    </p>
                                </div>
                            </div>
            </div>

                        {/* Form Actions */}
                        <div className="px-8 py-6 border-t border-gray-200 flex justify-end space-x-4">
                            <button
                                type="button"
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={formData.selectedPlatforms.length === 0 || !formData.image || uploading || loading}
                                className="px-6 py-2 bg-black text-white rounded-md hover:bg-black/80 hover:text-white! focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Generating...' : 'Generate Creatives'}
                            </button>
                                                </div>
                    </div>

                    {/* Section 3: Creative Sizes Preview */}
                    {creativeCreated && creativeData && (
                        <div className="bg-white rounded-lg shadow-sm mt-8">
                            <div className="px-8 py-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <Title level={3} className="mb-1">Creative Sizes</Title>
                                        <Text type="secondary">Based on your platform selection, these creative sizes will be generated.</Text>
                                    </div>
                                    <Space>
                                        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                            Filter
                                        </button>
                                        <Link href="/">
                                            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 hover:text-white!">
                                                Save
                                            </button>
                                        </Link>
                                    </Space>
                                </div>
                            </div>

                            <div className="px-8 py-6">
                                {/* Platform Filter Tabs */}
                                <div className="mb-6">
                                    <div className="flex space-x-1 border-b border-gray-200">
                                        {(() => {
                                            const tableData = prepareCreativeSizesData();
                                            const platformCounts = {};
                                            tableData.forEach(item => {
                                                platformCounts[item.platform] = (platformCounts[item.platform] || 0) + 1;
                                            });
                                            
                                            return [
                                                { key: 'all', label: `All ${tableData.length}`, count: tableData.length },
                                                ...Object.entries(platformCounts).map(([platform, count]) => ({
                                                    key: platform,
                                                    label: platformData[platform]?.name || platform,
                                                    count
                                                }))
                                            ];
                                        })().map(tab => (
                                            <button
                                                key={tab.key}
                                                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                                                    tab.key === 'all' 
                                                        ? 'border-blue-500 text-blue-600' 
                                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                                }`}
                                            >
                                                {tab.label} {tab.count > 0 && `(${tab.count})`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Table
                                    columns={[
                                        {
                                            title: 'PLATFORM',
                                            dataIndex: 'platformName',
                                            key: 'platform',
                                            render: (text, record) => (
                                                <div className="flex items-center space-x-3">
                                                    {record.platformIcon}
                                                    <div>
                                                        <div className="font-medium">{text}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {record.placement}
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        },
                                        {
                                            title: 'SIZE',
                                            dataIndex: 'size',
                                            key: 'size',
                                            render: (text, record) => (
                                                <div>
                                                    <div className="font-medium">
                                                        {record.ratio} ({record.size})
                                                    </div>
                                                </div>
                                            ),
                                        },
                                        {
                                            title: 'STATUS',
                                            key: 'status',
                                            render: () => (
                                                <Tag color="default" className="bg-gray-100 text-gray-700 border-gray-300">
                                                    Pending
                                                </Tag>
                                            ),
                                        },
                                        {
                                            title: 'PREVIEW',
                                            key: 'preview',
                                            render: (_, record) => {
                                                const isSquare = record.width === record.height;
                                                const isPortrait = record.height > record.width;
                                                
                                                // Calculate preview dimensions
                                                let previewWidth, previewHeight;
                                                if (isSquare) {
                                                    previewWidth = 80;
                                                    previewHeight = 80;
                                                } else if (isPortrait) {
                                                    previewWidth = 60;
                                                    previewHeight = 100;
                                                } else {
                                                    previewWidth = 100;
                                                    previewHeight = 60;
                                                }
                                                
                                                return (
                                                    <div className="flex items-center space-x-2">
                                                        
                                                        <div className="text-xs text-gray-500">
                                                            {record.ratio}
                                                        </div>
                                                        <Button
                                                            type="text"
                                                            icon={<EyeOutlined />}
                                                            onClick={(e) => {
                                                                console.log('Preview button clicked for:', record);
                                                                e.stopPropagation();
                                                                fetchPreviewImage(record.platform, record.size);
                                                            }}
                                                            title="Preview"
                                                            size="small"
                                                        />
                                                    </div>
                                                );
                                            },
                                        },
                                        {
                                            title: 'DCO VARIATIONS',
                                            key: 'dcoVariations',
                                            render: () => (
                                                <div className="space-y-1">
                                                    <div className="text-sm">0/3</div>
                                                    <Progress percent={0} size="small" showInfo={false} />
                                                </div>
                                            ),
                                        },
                                        {
                                            title: 'DCO STATUS',
                                            key: 'dcoStatus',
                                            render: () => (
                                                <Tag color="default" className="bg-gray-100 text-gray-700 border-gray-300">
                                                    Pending
                                                </Tag>
                                            ),
                                        },
                                        {
                                            title: 'IMPRESSIONS',
                                            key: 'impressions',
                                            render: () => (
                                                <div className="font-medium text-gray-400">-</div>
                                            ),
                                        },
                                        {
                                            title: 'CLICKS',
                                            key: 'clicks',
                                            render: () => (
                                                <div className="font-medium text-gray-400">-</div>
                                            ),
                                        },
                                        {
                                            title: 'AD SPEND',
                                            key: 'adSpend',
                                            render: () => (
                                                <div className="font-medium text-gray-400">-</div>
                                            ),
                                        },
                                        {
                                            title: 'CTR',
                                            key: 'ctr',
                                            render: () => (
                                                <div className="font-medium text-gray-400">-</div>
                                            ),
                                        },
                                        {
                                            title: 'ROAS',
                                            key: 'roas',
                                            render: () => (
                                                <div className="font-medium text-gray-400">-</div>
                                            ),
                                        },
                                        {
                                            title: 'UPLIFT',
                                            key: 'uplift',
                                            render: () => (
                                                <div className="font-medium text-gray-400">-</div>
                                            ),
                                        },
                                    ]}
                                    dataSource={prepareCreativeSizesData()}
                                    pagination={false}
                                    rowClassName={(record, index) => {
                                        return index % 2 === 0 ? 'bg-gray-50' : '';
                                    }}
                                    scroll={{ x: 1200 }}
                                />
                            </div>
                        </div>
                    )}
                    </form>
            </div>

            {/* Preview Modal */}
            <Modal
                title={previewTitle}
                open={previewModalVisible}
                onCancel={() => setPreviewModalVisible(false)}
                footer={null}
                width={800}
                centered
            >
                <div className="flex justify-center items-center min-h-[400px]">
                    {previewLoading ? (
                        <div className="text-center">
                            <Spin size="large" />
                            <div className="mt-4">Loading preview...</div>
                        </div>
                    ) : previewImage ? (
                        <div className="text-center">
                            <Image
                                src={previewImage}
                                alt="Creative Preview"
                                style={{ maxWidth: '100%', maxHeight: '500px' }}
                                fallback={
                                    <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
                                        <Text type="secondary">Failed to load image</Text>
                                    </div>
                                }
                            />
                        </div>
                    ) : (
                        <div className="text-center">
                            <Text type="secondary">No preview available</Text>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default UploadBaselineCreative;