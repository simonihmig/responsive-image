// import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';

import MyComponent from '../src/components/MyComponent.vue';

describe('MyComponent', () => {
  // it('renders properly with default props', () => {
  //   const wrapper = mount(MyComponent);
  //   expect(wrapper.text()).toContain('My Component');
  //   expect(wrapper.text()).toContain(
  //     'This is a sample component from the Vue plugin template',
  //   );
  //   expect(wrapper.find('button').text()).toBe('Click me');
  // });
  // it('renders with custom props', () => {
  //   const wrapper = mount(MyComponent, {
  //     props: {
  //       title: 'Custom Title',
  //       message: 'Custom Message',
  //       buttonText: 'Custom Button',
  //     },
  //   });
  //   expect(wrapper.text()).toContain('Custom Title');
  //   expect(wrapper.text()).toContain('Custom Message');
  //   expect(wrapper.find('button').text()).toBe('Custom Button');
  // });
  // it('emits click event when button is clicked', async () => {
  //   const wrapper = mount(MyComponent);
  //   const button = wrapper.find('button');
  //   await button.trigger('click');
  //   expect(wrapper.emitted()).toHaveProperty('click');
  //   expect(wrapper.emitted('click')?.[0]).toEqual(['Button clicked 1 times']);
  //   await button.trigger('click');
  //   expect(wrapper.emitted('click')?.[1]).toEqual(['Button clicked 2 times']);
  // });
  // it('increments click count correctly', async () => {
  //   const wrapper = mount(MyComponent);
  //   const button = wrapper.find('button');
  //   await button.trigger('click');
  //   await button.trigger('click');
  //   await button.trigger('click');
  //   const clickEvents = wrapper.emitted('click');
  //   expect(clickEvents).toHaveLength(3);
  //   expect(clickEvents?.[2]).toEqual(['Button clicked 3 times']);
  // });
});
