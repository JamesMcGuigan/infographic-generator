infographic-generator
=====================

A website for custom generating infographics


Infographic JSON Configuration Spec
===================================

<pre><code>
[ uuid: {
    name: "",
    metadata: {},

    height: <px>, // pixels
    width:  <px>, // pixels
    
    thumbnails: [{
        filetype: "jpeg"|"png"|"gif"|"svg",
        height:   <px>,
        width:    <px>
    }, ... ],
    
    images: [{
        id:         background|watermark,
        css: {
            background-position: "0px 0px",
            background-size:     auto,  
            background-repeat:   repeat|repeat-x|repeat-y|no-repeat
            background-image:    url(),
            margin-*:   0,            // TODO: remove
            width:      auto|100%,    // crop|scale
            height:     auto|100%,    // crop|scale
            zoom:       100%,
            z-index:    0,  // incrementing
            background: transparent
        },
        gravity:    Center|Top|TopRight|Right|BottomRight|Bottom|BottomLeft|Left|TopLeft,
    }, ... ],
    
    overlays: [{
        id:         1|2|etc,
        css: {
            margin:     <px|%>, 
            padding:    <px|%>, 
            opacity:    50%, 
            background: black, 
            height:     100%, 
            width:      100%,
        },
        gravity:    Center|Top|TopRight|Right|BottomRight|Bottom|BottomLeft|Left|TopLeft  
    }, ... ]
    
    
    text: [{
        content:    "",
        parent:     root|overlays[0]|images[0],
        gravity:    Center|Top|TopRight|Right|BottomRight|Bottom|BottomLeft|Left|TopLeft
        css: {
            font-size:   12px,
            font-family: "Helvetica Neue",
            margin:      <px|%>,  // default: 0px 
            padding:     <px|%>,  // default: 0px
            opacity:     100%, 
            background:  transparent
        }
    }, ... ]
    
    data: {
        url:     <url>,
        format:  json|csv,
        mapping: ???
    },

    charts: [{
        type:    bar|stacked-bar|donut|double-donut|column|stacked-column|line|bubble|area|scatter|
        options: <d3.js parameters>,
        
        parent:  root|overlays[0]|images[0],
        gravity: Center|Top|TopRight|Right|BottomRight|Bottom|BottomLeft|Left|TopLeft
        css: {
            height:      <px|%>,  
            width:       <px|%>,
            margin:      <px|%>,  // default: 0px 
            padding:     <px|%>,  // default: 0px
            opacity:     100%, 
            background:  transparent
        }
    }, ...]

    

}, ... ]
</code></pre>

Example
<code><pre>

{ 
    defaults: {
        all: {
            css: {
                position: "relative",
                height:   "auto",
                width:    "auto",
                margin:   "0",
                padding:  "0"
            }
        },
        background: 
        image: {
            type: "image",
            css: {
            }
        },
        text: {
            font-size:   12px,
            font-family: "Helvetica Neue",
            color:       "white"        
        }
    },
    "infographics": [{
        type: "image-background",
        css: {
            height:       800px,
            width:        600px,
            padding:      20px,
            padding-left: 10px
        },
        image: {
            url: "http://www.sport-kingston.co.uk/Football-330vlarge.jpg",
            width:  100%,
            height: 100%
        },
        children: [
            {
                type: "image-watermark",
                image: {
                    url: "http://matchstory.co.uk/wp-content/uploads/2013/08/ms_web_logo3.png",
                },
                css: {
                    position: "absolute"
                },
                gravity: "BottomLeft"  
            },
            {
                type:    "text",
                content: "THE MEN WHO'LL RUN THE SHOW",
                gravity: "TopLeft"
                css: {
                    font-size:   24px,
                    line-height: 50px,
                    font-family: "Helvetica Neue",
                    color:       "white"        
                }
            },
            {
                type:    "overlay",
                gravity: "Left",
                css: {
                    opacity:       "50%",
                    margin-top:    "50px",
                    margin-bottom: "50px",
                    background:    ""
                },
                children: [
                    {
                        type:    "text",
                        content: "Players who have completed the most passes in the two squads",
                        gravity: "TopLeft"
                        css: {
                            font-size:   "12px",
                            line-height: "20px",
                            font-family: "Helvetica Neue",
                            color:       "white"        
                        }
                    },
                    {
                        type:    "chart"
                    },
                ]
            }

        ]
    }]
}
</code></pre>
