import React, {useEffect, useState} from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TextInput,
    KeyboardAvoidingView, 
    TouchableWithoutFeedback, 
    Keyboard, 
    Switch,
    Image } from 'react-native';
import Button from '@app/components/Button';
import * as ImagePicker from 'expo-image-picker';
import Dropdown from '@app/components/Dropdown';
import TagInput from '@app/components/TagInput';

// Create Group Screen
function CreateGroup( {navigation} ) {
    const [activeScreen, setActiveScreen] = useState(0);

    // 1st SCREEN INPUTS
    const [title, setTitle] = useState('');
    const [handler, setHandler] = useState('');
    const [description, setDescription] = useState('');
    const [banner, setBanner] = useState('');
    const [icon, setIcon] = useState('');

    // 2nd SCREEN INPUTS
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState([]);
    const [website, setWebsite] = useState('');
    const [location, setLocation] = useState('');
    const [isInviteOnly, setIsInviteOnly] = useState(false);

    const categoryOptions = ['Sports', 'Education', 'Business', 'Gaming'];
    const [inputValue, setInputValue] = useState('');

    // 3rd SCREEN INPUTS
    const [twitterLink, setTwitterLink] = useState('');
    const [facebookLink, setFacebookLink] = useState('');
    const [instagramLink, setInstagramLink] = useState('');
    const [discordLink, setDiscordLink] = useState('');
    const [linkedInLink, setLinkedInLink] = useState('');
    const [githubLink, setGithubLink] = useState('');

    // Input Validation
    const [titleError, setTitleError] = useState('');
    const [handlerError, setHandlerError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [bannerError, setBannerError] = useState('');
    const [iconError, setIconError] = useState('');

    const [categoryError, setCategoryError] = useState('');
    const [tagsError, setTagsError] = useState('');
    const [websiteError, setWebsiteError] = useState('');
    const [locationError, setLocationError] = useState('');

    const [twitterLinkError, setTwitterLinkError] = useState('');
    const [facebookLinkError, setFacebookLinkError] = useState('');
    const [instagramLinkError, setInstagramLinkError] = useState('');
    const [discordLinkError, setDiscordLinkError] = useState('');
    const [linkedInLinkError, setLinkedInLinkError] = useState('');
    const [githubLinkError, setGithubLinkError] = useState('');


    

    useEffect(() => {
        handleInputValidationScreen1();
    }, [title, handler, description, banner, icon]);

    useEffect(() => {
        handleInputValidationScreen2();
    }, [category, tags, location, website])

    useEffect(() => {
        handleInputValidationScreen3();
    }, [twitterLink, facebookLink, instagramLink, discordLink, linkedInLink, githubLink])
    
    
    function handleInputValidationScreen1() {
        let isValid = true;

        const titleRegex = /^(?![a-zA-Z0-9]+$).*$/;
        const handlerRegex = /^(?!(\w{1,15})$).*$/

        if(title.trim() === ``)
        {
            setTitleError(`Please enter a title`);
            isValid = false;
        }
        else if(titleRegex.test(title))
        {
            setTitleError(`Can only contain letters, numbers, and underscores.`);
            isValid = false;
        }
        else
        {
            setTitleError(``);
        }

        if(handler.trim() === ``)
        {
            setHandlerError(`Please enter a handler`);
            isValid = false;
        }
        else if(handlerRegex.test(handler))
        {
            setHandlerError(`Can only contain letters, numbers, and underscores.`);
            isValid = false;
        }
        else
        {
            setHandlerError(``);
        }

        if(description.trim() === ``)
        {
            console.log(0);
            setDescriptionError(`Please enter a description`);
            isValid = false;
        }
        else
        {
            setDescriptionError(``);
        }

        if(banner.trim() === ``)
        {
            setBannerError(`Please pick a banner image`);
            isValid = false;
        }
        else
        {
            setBannerError(``);
        }

        if(icon.trim() === ``)
        {
            setIconError(`Please pick a icon image`);
            isValid = false;
        }
        else
        {
            setIconError(``);
        }

        // isValid = true; //for testing
        return isValid;
    }

    function handleInputValidationScreen2(){
        let isValid = true;
        const websiteRegex = /^(?!(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$).+$/i

        if (category.trim() === ``)
        {
            setCategoryError(`Please select a category`);
            isValid = false;
        }
        else
        {
            setCategoryError(``);
        }

        if (tags.length < 3)
        {
            setTagsError(`Please select at least 3 tags`);
            isValid = false;
        }
        else
        {
            setTagsError(``);
        }


        if (website.trim() === ``)
        {
            setWebsiteError(``);
        }
        else if(websiteRegex.test(website))
        {
            setWebsiteError(`Invalid Website Link`);
            isValid = false;
        }
        else
        {
            setWebsiteError(``);
        }

        return isValid;
    }
    
    function handleInputValidationScreen3(){
        let isValid = true;

        const twitterRegex = /^(?!https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$)/;
        const facebookRegex = /^(?!https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9_]+\/?$)/;
        const discordRegex = /^(?!https?:\/\/(www\.)?discord\.gg\/[a-zA-Z0-9]+).*$/;
        const instagramRegex = /^(?!https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/[a-zA-Z0-9_]+\/?$)/;
        const linkedinRegex = /^(?!https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$)/;
        const githubRegex = /^(?!https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$)/;



        if (twitterLink.trim() === ``)
        {
            setTwitterLinkError(``);
        }
        else if(twitterRegex.test(twitterLink))
        {
            setTwitterLinkError(`Invalid Twitter Link`);
            isValid = false;
        }
        else
        {
            setTwitterLinkError(``);
        }

        if (facebookLink.trim() === ``)
        {
            setFacebookLinkError(``);
        }
        else if(facebookRegex.test(facebookLink))
        {
            setFacebookLinkError(`Invalid Facebook Link`);
            isValid = false;
        }
        else
        {
            setFacebookLinkError(``);
        }

        if (instagramLink.trim() === ``)
        {
            setInstagramLinkError(``);
        }
        else if(instagramRegex.test(instagramLink))
        {
            setInstagramLinkError(`Invalid Instagram Link`);
            isValid = false;
        }
        else
        {
            setInstagramLinkError(``);
        }

        if (discordLink.trim() === ``)
        {
            setDiscordLinkError(``);
        }
        else if(discordRegex.test(discordLink))
        {
            setDiscordLinkError(`Invalid Discord Link`);
            isValid = false;
        }
        else
        {
            setDiscordLinkError(``);
        }

        if (linkedInLink.trim() === ``)
        {
            setLinkedInLink(``);
        }
        else if(linkedinRegex.test(linkedInLink))
        {
            setLinkedInLinkError(`Invalid LinkedIn Link`);
            isValid = false;
        }
        else
        {
            setLinkedInLinkError(``);
        }

        if (githubLink.trim() === ``)
        {
            setGithubLinkError(``);
        }
        else if(githubRegex.test(githubLink))
        {
            setGithubLinkError(`Invalid Github Link`);
            isValid = false;
        }
        else
        {
            setGithubLinkError(``);
        }

        return isValid;

    }

    function emptyForm()
    {
        setTitle('');
        setHandler('');
        setDescription('');
        setBanner('');
        setIcon('');

        setLocation('');
        setWebsite('');

        setTwitterLink('');
        setFacebookLink('');
        setDiscordLink('');
        setLinkedInLink('');
        setGithubLink('');
    }

    const selectBannerImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 5],
            quality: 1,
            base64: true, // Enable base64 option
          });

        const { assets } = result;
      
        if (!result.canceled) {
            // Process the selected image
            const { base64 } = assets[0];
            // console.log("Banner image picked: " + base64);
            setBanner(base64);
        }
      };

    const selectIconImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true, // Enable base64 option
          });

        const { assets } = result;
        
        if (!result.canceled) {
            // Process the selected image
            const { base64 } = assets[0];
            // console.log("Icon image picked: " + base64);
            setIcon(base64);
        }
    };

    switch(activeScreen)
    {
        case 0:
            return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button 
                onPress={() => navigation.navigate('Feed')}
                title='Back'
                />
                <Button 
                onPress={() => setActiveScreen(1) } 
                title='CREATE GROUP'
                />
                <Text>Create Group Screen</Text>
            </View>
            );
        
        case 1:
            return (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Button 
                            onPress={() => {
                                setActiveScreen(0);
                                emptyForm();
                            }}
                            title='BACK'
                        />


                        <View>
                            <Text style={styles.header}>
                                Title<Text style={styles.important}>* {titleError}</Text>
                            </Text>
                            <TextInput value={title} placeholder="title" onChangeText={ newText => setTitle(newText) }  style={styles.input} maxLength={20}/>
                        </View>


                        <View>
                            <Text style={styles.header}>
                                Handler<Text style={styles.important}>* {handlerError}</Text>
                            </Text>
                            <TextInput value={handler} placeholder="@unique_name" onChangeText={ newText => setHandler(newText) } style={styles.input} maxLength={15}/>
                        </View>


                        <View>
                            <Text style={styles.header}>
                                Description<Text style={styles.important}>* {descriptionError}</Text>
                            </Text>
                            <TextInput value={description} placeholder="This is the description." onChangeText={ newText => setDescription(newText) } style={styles.input} maxLength={150} />
                        </View>


                        <View> 
                            {/* Replace with image/media picker */}
                            <Text style={styles.header}>
                                Banner<Text style={styles.important}>* {bannerError}</Text>
                            </Text>
                            <View style={styles.imageSelectorContainer}>
                                <Image 
                                    source={{ uri: `data:image/jpeg;base64,${banner}` }}
                                    style={styles.bannerDisplay}
                                />
                                <View style={styles.imageSelectorBtnContainer}>
                                    <Button title="Select image" onPress={selectBannerImage}  />
                                </View>
                            </View>
                        </View>


                        <View>
                            {/* Replace with image/media picker */}
                            <Text style={styles.header}>
                                Icon<Text style={styles.important}>* {iconError}</Text>
                            </Text>
                            <View style={styles.imageSelectorContainer}>
                                <Image
                                    source={{ uri: `data:image/jpeg;base64,${icon}` }}
                                    style={styles.iconDisplay}
                                />
                                <View style={styles.imageSelectorBtnContainer}>
                                    <Button title="Select image" onPress={selectIconImage}  />

                                </View>
                            </View>
                        </View>


                        <View style={styles.btnContainer}>
                            <Button title="NEXT" onPress={() => 
                                {                            
                                    const isValid = handleInputValidationScreen1();
                                    
                                    if(isValid)
                                    {
                                        setActiveScreen(2);
                                    }
                                }
                                } />
                        </View>

                        
                    </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            );

        case 2:
            
            const toggleSwitch = () => setIsInviteOnly(previousState => !previousState);

            return (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Button 
                            onPress={() => setActiveScreen(1)}
                            title='BACK'
                        />

                        
                        <View>
                            <Text style={styles.header}>
                                Category<Text style={styles.important}>* {categoryError} </Text>
                            </Text>
                            <Dropdown options={categoryOptions} value={category} setValue={setCategory}/>
                        </View>


                        <View>
                            <Text style={styles.header}>
                                Tags<Text style={styles.important}>* {tagsError} </Text>
                            </Text>
                            <TagInput value={inputValue} setValue={setInputValue} tags={tags} setTags={setTags} maxTags={10}/>
                        </View>

                        
                        <View>
                            <Text style={styles.header}>
                                Location<Text value={website}style={styles.important} onChangeText={ newText => setLocation(newText) }> {locationError} </Text>
                            </Text>
                            <TextInput placeholder="Username" style={styles.input} />
                        </View>


                        <View>
                            <Text style={styles.header}>
                                Webite<Text style={styles.important}> {websiteError} </Text>
                            </Text>
                            <TextInput value={website} placeholder="https://example.com" onChangeText={ newText => setWebsite(newText) } style={styles.input} />
                        </View>


                        <View>
                            <Text style={styles.header}>Invite Only</Text>
                            <Switch
                                trackColor={{false: '#767577', true: '#81b0ff'}}
                                thumbColor={isInviteOnly ? '#ffffff' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitch}
                                value={isInviteOnly}
                            />
                        </View>


                        <View style={styles.btnContainer}>
                            <Button title="NEXT" onPress={() => 
                                {
                                    setActiveScreen(3);;
                                }
                                } />
                        </View>


                    </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            );

        case 3:
            return (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Button 
                            onPress={() => setActiveScreen(2)}
                            title='BACK'
                        />
                        <View>
                            <Text style={styles.header}>
                                Twitter<Text style={styles.important}> {twitterLinkError} </Text>
                            </Text>
                            <TextInput value={twitterLink} placeholder="https://twitter.com/abc123" onChangeText={ newText => setTwitterLink(newText)} style={styles.input} />
                        </View>
                        <View>
                            <Text style={styles.header}>
                                Facebook<Text style={styles.important}> {facebookLinkError} </Text>
                            </Text>
                            <TextInput value={facebookLink} placeholder="https://facebook.com/abc123" onChangeText={ newText => setFacebookLink(newText)} style={styles.input} />
                        </View>
                        <View>
                            <Text style={styles.header}>
                                Instagram<Text style={styles.important}> {instagramLinkError} </Text>
                            </Text>
                            <TextInput value={instagramLink} placeholder="https://instagram.com/abc123" onChangeText={ newText => setInstagramLink(newText)} style={styles.input} />
                        </View>
                        <View>
                            <Text style={styles.header}>
                                Discord<Text style={styles.important}> {discordLinkError} </Text>
                            </Text>
                            <TextInput value={discordLink}  placeholder="https://discord.gg/abc123" onChangeText={ newText => setDiscordLink(newText)} style={styles.input} />
                        </View>
                        <View>
                            <Text style={styles.header}>
                                LinkedIn<Text style={styles.important}> {linkedInLinkError} </Text>
                            </Text>
                            <TextInput value={linkedInLink}  placeholder="https://linkedin.com/abc123" onChangeText={ newText => setLinkedInLink(newText)} style={styles.input} />
                        </View>
                        <View>
                            <Text style={styles.header}>
                                Github<Text style={styles.important}> {githubLinkError} </Text>
                            </Text>
                            <TextInput value={githubLink}  placeholder="https://github.com/abc123e" onChangeText={ newText => setGithubLink(newText)} style={styles.input} />
                        </View>
                        <View style={styles.btnContainer}>
                            <Button title="SUBMIT" onPress={() => 
                            {
                                const isValid = handleInputValidationScreen3();
                                    
                                if(isValid)
                                {
                                    emptyForm();
                                    setActiveScreen(0);
                                }

                                // code for updating the group here?
                            
                            }
                                
                            }/>
                        </View>
                    </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            );

    }
    
  }

  const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 6,
        borderWidth: 1,
        padding: 10,
    },
    container: {
        flex: 1,
    },
    inner: {
        padding: 36,
        flex: 1,
        justifyContent: 'space-around',
    },
    header: {
        padding: 10,
        fontSize: 20,
    },
    important: {
        color: 'red',
        fontSize: 15,
    },
    btnContainer: {
        backgroundColor: 'white',
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 6,
        borderWidth: 2,
        borderColor: 'black',
    },
    imageSelectorBtnContainer: {
        backgroundColor: 'white',
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 6,
        borderWidth: 1,
        borderColor: 'black',
        height: 50,
        
    },
    bannerDisplay: {
        width: 200,
        height: 100,
        borderWidth: 1,
    },  
    iconDisplay: {
        width: 100,
        height: 100,
        borderRadius: 100,
        borderWidth: 1,
    },
    imageSelectorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
  });

  export {
    CreateGroup
  }