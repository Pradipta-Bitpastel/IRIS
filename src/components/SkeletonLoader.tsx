import * as React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function SkeletonLoader({ type }) {
    return (
        <>
            {
                type === "logs" ?
                    <Box sx={{ 'border': '1px solid rgba(255, 255, 255, 0.12)', 'padding': '5px 10px', 'border-radius': '12px', 'marginTop': '10px ' }}>
                        <Skeleton animation="wave" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
                        <Skeleton animation="wave" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
                        <Skeleton animation="wave" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
                        <Skeleton animation={false} sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
                    </Box>
                    :
                    type === "words" ?
                        <Box>
                            <Skeleton animation="wave" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
                            <Skeleton animation="wave" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
                            <Skeleton animation="wave" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
                            <Skeleton animation="wave" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
                            <Skeleton animation={false} sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
                        </Box>
                        :
                        type === "wordcloud" ?
                            <Box>
                                <Skeleton animation="wave" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
                                <Skeleton animation="wave" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
                                <Skeleton animation="wave" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
                            </Box>
                            :
                            type === "gauge" ?
                                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: '10px' }} height={115}>
                                    <Skeleton
                                        variant="circular"
                                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }}
                                        // variant="rectangular"
                                        width={100}
                                        height={100}
                                    />
                                    <Skeleton animation="wave" sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} width={100} />
                                </Box>
                                :
                                ''
            }
        </>


    );
}
